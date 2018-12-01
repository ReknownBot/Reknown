async function welcomeMessage (Client, member, guild) {
  const welcomeToggle = (await Client.sql.query('SELECT bool FROM togglewelcome WHERE guildid = $1', [guild.id])).rows[0];
  const channelRow = (await Client.sql.query('SELECT channel FROM welcomechannel WHERE guildid = $1', [guild.id])).rows[0];
  if (!welcomeToggle || !welcomeToggle.bool) return;
  const welcomeChannel = channelRow ? guild.channels.get(channelRow.channel) : guild.channels.find(c => c.type === 'text' && c.name === 'action-log');
  if (!welcomeChannel) return;
  if (!Client.checkClientPerms(welcomeChannel, 'SEND_MESSAGES', 'VIEW_CHANNEL', 'EMBED_LINKS')) return;

  const msgRow = (await Client.sql.query('SELECT custommessage FROM customMessages WHERE guildid = $1', [guild.id])).rows[0];
  const msg = msgRow ? msgRow.custommessage
    .replace('<Guild>', guild.name)
    .replace('<User>', member.toString())
    .replace('<MemberCount>', guild.memberCount)
    : `${member}, Welcome to **${member.guild.name}!** There are ${member.guild.memberCount} members now.`;

  const embed = new Client.Discord.MessageEmbed()
    .setDescription(msg)
    .setColor(0x00FF00)
    .setTimestamp();

  return welcomeChannel.send(embed);
}

function logMessage (Client, member, guild) {
  const embed = new Client.Discord.MessageEmbed()
    .setTitle('Member Joined')
    .addField('Member', `${member.user.tag} (${member.id})`)
    .setThumbnail(member.user.displayAvatarURL({ size: 2048 }))
    .setTimestamp()
    .setColor(0x00FF00);
  return require('../functions/sendlog.js')(Client, embed, guild.id);
}

async function autorole (Client, member, guild) {
  const { rows } = await Client.sql.query('SELECT roleid FROM autorole WHERE guildId = $1', [guild.id]);
  if (rows.length === 0) return;
  if (!member.guild.me.hasPermission('MANAGE_ROLES')) return;
  rows.forEach(r => {
    const autoRole = guild.roles.get(r.roleid);
    if (!autoRole) Client.sql.query('DELETE FROM autorole WHERE guildId = $1 AND roleId = $2', [guild.id, r.roleid]);
    else if (autoRole.position < guild.me.roles.highest.position) member.roles.add(autoRole, 'Reknown Autorole');
  });
}

async function levelrole (Client, member, guild) {
  const toggleLev = (await Client.sql.query('SELECT bool FROM togglelevel WHERE guildid = $1', [guild.id]));
  if (!toggleLev || !toggleLev.bool) return;
  const { rows } = await Client.sql.query('SELECT roleid, level FROM levelrole WHERE guildid = $1', [guild.id]);
  if (rows.length === 0) return;
  rows.forEach(async row => {
    const levelRole = guild.roles.get(row.roleid);
    if (!levelRole) Client.sql.query('DELETE FROM levelrole WHERE guildid = $1 AND roleid = $2', [guild.id, row.roleid]);
    else if (levelrole.position < guild.me.roles.highest.position) {
      const curLevel = (await Client.sql.query('SELECT level FROM scores WHERE userid = $1', [member.id])).rows[0].level;
      if (curLevel < row.level) return;
      member.roles.add(levelrole, 'Level Role');
    }
  });
}

function mute (Client, member, guild) {
  if (!Client.mutes.includes(member.id)) return;
  if (!guild.me.hasPermission('MANAGE_ROLES')) return;
  const mutedRole = guild.roles.find(r => r.name === 'Muted');
  if (mutedRole && !member.roles.has(mutedRole.id)) member.roles.add(mutedRole);
}

module.exports = (Client) => {
  return Client.bot.on('guildMemberAdd', member => {
    const guild = member.guild;
    if (!guild.available) return;
    if (member === guild.me) return;

    logMessage(Client, member, guild);
    welcomeMessage(Client, member, guild);
    autorole(Client, member, guild);
    levelrole(Client, member, guild);
    mute(Client, member, guild);
  });
};
