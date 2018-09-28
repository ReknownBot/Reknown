module.exports = async (Client, embed, guildID) => {
  const toggled = (await Client.sql.query('SELECT bool FROM actionlog WHERE guildid = $1', [guildID])).rows[0];
  // If action log isn't enabled for the server
  if (!toggled || !toggled.bool) return;

  const channel = Client.bot.guilds.get(guildID).channels.get((await Client.sql.query('SELECT channelid FROM logchannel WHERE guildid = $1', [guildID])).rows[0]) || Client.bot.guilds.get(guildID).channels.find(c => c.name === 'action-log' && c.type === 'text');
  if (!channel) return;

  // No perms, return
  if (!Client.checkClientPerms(channel, 'SEND_MESSAGES', 'VIEW_CHANNEL', 'EMBED_LINKS')) return;

  return channel.send(embed);
};
