module.exports.run = async (client, embed, guild) => {
  const toggledRow = (await client.query('SELECT bool FROM actionlog WHERE guildid = $1', [guild.id])).rows[0];
  if (!toggledRow || !toggledRow.bool) return;

  const channelRow = (await client.query('SELECT channelid FROM logchannel WHERE guildid = $1', [guild.id])).rows[0];
  if (!channelRow) return;

  const channel = client.bot.channels.get(channelRow.channelid) || guild.channels.find(c => c.name === 'action-log' && c.type === 'text');
  if (!channel) return;
  if (!channel.permissionsFor(client.user).has('SEND_MESSAGES', 'VIEW_CHANNEL', 'EMBED_LINKS')) return;

  return channel.send(embed);
};
