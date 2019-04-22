/**
 * @param {import('../../structures/client.js')} Client
 * @param {import('discord.js').Message} message
 * @param {String[]} args
*/
module.exports = async (Client, message, args) => {
  const channel = args[1] ? Client.getObj(args[1], {
    type: 'channel',
    filter: 'text',
    guild: message.guild
  }) : message.channel;
  if (!channel) return Client.functions.get('argFix')(Client, message.channel, 1, 'Did not find a channel with that query.');
  if (!channel.name.startsWith('ticket') || isNaN(channel.topic)) return Client.functions.get('argFix')(Client, message.channel, 1, 'Only ticket channels may be closed.');
  if (!Client.checkClientPerms(channel, 'MANAGE_CHANNELS')) return Client.functions.get('noClientPerms')(message, ['Manage Channel'], channel);
  if (channel.topic !== message.author.id && !await Client.checkPerms('close', 'ticket', message.member)) return Client.functions.get('noCustomPerm')(message, 'ticket.close');
  return channel.delete();
};

module.exports.help = {
  name: 'close',
  desc: 'Closes a ticket.',
  category: 'util',
  usage: '?close [Channel]',
  aliases: []
};
