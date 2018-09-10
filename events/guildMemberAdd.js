async function welcomeMessage (Client, member, guild) {
  const welcomeToggle = (await Client.sql.query('SELECT * FROM togglewelcome WHERE guildid = $1', [guild.id])).rows[0];
  const channelRow = (await Client.sql.query('SELECT * FROM welcomechannel WHERE guildid = $1', [guild.id])).rows[0];
  if (!welcomeToggle || !welcomeToggle.bool) return;
  const welcomeChannel = channelRow ? guild.channels.get(channelRow.channel) : guild.channels.find(c => c.type === 'text' && c.name === 'action-log');
  if (!welcomeChannel) return;
  if (!Client.checkClientPerms(welcomeChannel, 'SEND_MESSAGES', 'VIEW_CHANNEL', 'EMBED_LINKS')) return;

  const msgRow = (await Client.sql.query('SELECT * FROM customMessages WHERE guildid = $1', [guild.id])).rows[0];
  const msg = msgRow ? msgRow.custommessage
    .replace('<Guild>', guild.name)
    .replace('<User>', member.toString())
    .replace('<MemberCount>', guild.memberCount)
    : `${member}, Welcome to **${member.guild.id}!** There are ${member.guild.memberCount} members now.`;

  const embed = new Client.Discord.MessageEmbed()
    .setDescription(msg)
    .setColor(0x00FF00)
    .setTimestamp();

  return welcomeChannel.send(embed);
}

async function logMessage (Client, member, guild) {
  const logToggle = (await Client.sql.query('SELECT * FROM actionlog WHERE guildid = $1', [guild.id])).rows[0];
  const logRow = (await Client.sql.query('SELECT * FROM logchannel WHERE guildid = $1', [guild.id])).rows[0];
  if (!logToggle || !logToggle.bool) return;
  const logChannel = logRow ? guild.channels.get(logRow.channelid) : guild.channels.find(c => c.type === 'text' && c.name === 'action-log');
  if (!logChannel) return;
  if (!Client.checkClientPerms(logChannel, 'SEND_MESSAGES', 'VIEW_CHANNEL', 'EMBED_LINKS')) return;

  const embed = new Client.Discord.MessageEmbed()
    .setTitle('Member Joined')
    .addField('Member', `${member.user.tag} (${member.id})`)
    .setThumbnail(member.user.displayAvatarURL())
    .setTimestamp()
    .setColor(0x00FF00);

  return logChannel.send(embed);
}

module.exports = async (Client, member) => {
  const guild = member.guild;
  if (!guild.available) return;
  if (!guild.me) guild.me = await guild.members.fetch(Client.bot.user);
  if (member === guild.me) return;

  logMessage(Client, member, guild);
  return welcomeMessage(Client, member, guild);
};
