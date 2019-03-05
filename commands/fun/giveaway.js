module.exports = async (Client, message, args) => {
  if (!message.member.hasPermission('MANAGE_GUILD')) return message.reply('You do not have the `Manage Server` permission!');

  if (!args[1]) return message.reply('You have to provide a channel that the message is in!');
  const channel = Client.getObj(args[1], { guild: message.guild, type: 'channel' });
  if (!channel) return message.reply('The channel you provided is invalid!');
  if (!Client.checkClientPerms(channel, 'VIEW_CHANNEL')) return Client.functions.get('noClientPerms')(message, ['View Channels'], channel);

  if (!args[2]) return message.reply('You have to provide the ID of the message!');
  const msg = await channel.messages.fetch(args[2]).catch(() => 'failed');
  if (!msg || msg === 'failed') return message.reply('The message ID you provided is invalid! (Make sure the message is in the channel you provided.)');

  const reaction = msg.reactions.get('🎉');
  reaction ? await reaction.users.fetch() : null;
  if (!reaction || reaction.users.filter(u => !u.bot).size === 0) return message.reply('No user reacted with 🎉 in that message!');

  const amt = args[3] || '1';
  if (isNaN(amt)) return message.reply('The amount of winners must be a number!');
  if (amt > 5) return message.reply('The amount cannot exceed 5!');
  if (amt < 1) return message.reply('The amount may not be under 1!');
  if (amt.includes('.')) return message.reply('The amount may not be a decimal!');

  const winners = reaction.users.filter(u => !u.bot).random(amt).filter(u => u).map(u => u.tag);
  return message.channel.send(`The ${winners.length === 1 ? 'winner is' : 'winners are'} ${winners.list()}!`);
};

module.exports.help = {
  name: 'giveaway',
  desc: 'Picks a random winner(s) from a message. The reaction emoji should be 🎉.',
  category: 'fun',
  usage: '?giveaway <Channel> <Message ID> [Amount of Winners]',
  aliases: []
};
