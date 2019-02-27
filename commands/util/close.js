module.exports = async (Client, message, args) => {
  const channel = args[1] ? Client.getObj(args[1], {
    type: 'channel',
    filter: 'text',
    guild: message.guild
  }) : message.channel;
  if (!channel) return message.reply('I did not find a channel with the channel you provided!');
  if (!channel.name.startsWith('ticket') || isNaN(channel.topic)) return message.reply('You may only close ticket channels!');
  if (!Client.checkClientPerms(channel, 'MANAGE_CHANNELS')) return message.reply('I am missing the required permission `Manage Channels` in the ticket channel!');
  if (channel.topic !== message.author.id && !await Client.checkPerms('close', 'ticket', message.member)) return message.reply(':x: Sorry, but you do not have the `ticket.close` permission.');
  return channel.delete();
};

module.exports.help = {
  name: 'close',
  desc: 'Closes a ticket.',
  category: 'util',
  usage: '?close [Channel]',
  aliases: []
};
