/**
 * @param {import('../structures/client.js')} Client
 * @param {import('discord.js').MessageEmbed} embed
 * @param {String} guildID
 */
module.exports = async (Client, embed, guildID) => {
  const toggled = (await Client.sql.query('SELECT bool FROM actionlog WHERE guildid = $1', [guildID])).rows[0];
  if (!toggled || !toggled.bool) return;

  const channelRow = (await Client.sql.query('SELECT channelid FROM logchannel WHERE guildid = $1', [guildID])).rows[0];
  if (!channelRow) return;

  const channel = Client.bot.channels.get(channelRow.channelid) || Client.bot.guilds.get(guildID).channels.find(c => c.name === 'action-log' && c.type === 'text');
  if (!channel) return;

  if (!Client.checkClientPerms(channel, 'SEND_MESSAGES', 'VIEW_CHANNEL', 'EMBED_LINKS')) return;

  return channel.send(embed);
};
