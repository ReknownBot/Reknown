/**
 * @param {import('../structures/client.js')} Client
 * @param {import('discord.js').GuildMember} member
 * @param {import('discord.js').Guild} guild
 */
async function welcomeMessage(Client, member, guild) {
  const welcomeToggle = (await Client.sql.query('SELECT bool FROM togglewelcome WHERE guildid = $1', [guild.id])).rows[0];
  const channelRow = (await Client.sql.query('SELECT channel FROM welcomechannel WHERE guildid = $1', [guild.id])).rows[0];
  if (!welcomeToggle || !welcomeToggle.bool) return;
  const welcomeChannel = channelRow ? guild.channels.get(channelRow.channel) : guild.channels.find(c => c.type === 'text' && c.name === 'action-log');
  if (!welcomeChannel) return;
  if (!Client.checkClientPerms(welcomeChannel, 'SEND_MESSAGES', 'VIEW_CHANNEL', 'EMBED_LINKS')) return;

  const msgRow = (await Client.sql.query('SELECT msg FROM welcomemsg WHERE guildid = $1', [guild.id])).rows[0];
  const msg = msgRow ? msgRow.custommessage
    .replace('<Guild>', guild.name)
    .replace('<User>', member.toString())
    .replace('<MemberCount>', Client.formatNum(guild.memberCount))
    : `${member}, Welcome to **${member.guild.name}!** There are ${Client.formatNum(member.guild.memberCount)} members now.`;

  const embed = new Client.Discord.MessageEmbed()
    .setDescription(msg)
    .setColor(0x00FF00)
    .setTimestamp();

  return welcomeChannel.send(embed);
}

/**
 * @param {import('../structures/client.js')} Client
 * @param {import('discord.js').GuildMember} member
 * @param {import('discord.js').Guild} guild
 */
function logMessage (Client, member, guild) {
  const embed = new Client.Discord.MessageEmbed()
    .setTitle('Member Joined')
    .addField('Member', `${member.user.tag} (${member.id})`)
    .setThumbnail(member.user.displayAvatarURL({ size: 2048 }))
    .setTimestamp()
    .setColor(0x00FF00);
  return Client.functions.get('sendlog')(Client, embed, guild.id);
}

/**
 * @param {import('../structures/client.js')} Client
 * @param {import('discord.js').GuildMember} member
 * @param {import('discord.js').Guild} guild
 */
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

/**
 * @param {import('../structures/client.js')} Client
 * @param {import('discord.js').GuildMember} member
 * @param {import('discord.js').Guild} guild
 */
function mute (Client, member, guild) {
  if (!Client.mutes.has(member.id)) return;
  if (!guild.me.hasPermission('MANAGE_ROLES')) return;
  const mutedRole = guild.roles.find(r => r.name === 'Muted');
  if (mutedRole && !member.roles.has(mutedRole.id)) member.roles.add(mutedRole);
}

/**
 * @param {import('../structures/client.js')} Client
 */
module.exports = Client => {
  return Client.bot.on('guildMemberAdd', async member => {
    const guild = member.guild;
    if (!guild.available) return;
    if (member.partial) await member.fetch();
    if (member === guild.me) return;

    logMessage(Client, member, guild);
    welcomeMessage(Client, member, guild);
    levelrole(Client, member, guild);
    mute(Client, member, guild);
  });
};
