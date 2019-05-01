/**
 * @param {import('../structures/client.js')} Client
 */
module.exports = (Client) => {
  return Client.bot.on('messageReactionRemoveAll', async message => {
    if (message.partial) await message.fetch();
    if (message.author.partial) await message.author.fetch();
    if (message.channel.type !== 'text') return;

    const toggled = (await Client.sql.query('SELECT bool FROM togglestar WHERE guildid = $1 AND bool = $2', [message.guild.id, 1])).rows[0];
    if (!toggled) return;

    const channelRow = (await Client.sql.query('SELECT channelid FROM starchannel WHERE guildid = $1', [message.guild.id])).rows[0];
    const msgRow = (await Client.sql.query('SELECT * FROM star WHERE msgid = $1', [message.id])).rows[0];

    const sChannel = channelRow ? message.guild.channels.get(channelRow.channelid) : message.guild.channels.find(chan => chan.name === 'starboard' && chan.type === 'text');
    Client.sql.query('DELETE FROM star WHERE msgid = $1', [message.id]);
    if (!sChannel) return;

    if (!Client.checkClientPerms(sChannel, 'VIEW_CHANNEL')) return;
    if (!msgRow) return;
    const sMessage = await sChannel.messages.fetch(msgRow.editid);
    if (sMessage && !sMessage.deleted) return sMessage.delete();
  });
};
