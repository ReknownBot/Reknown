/**
 * @param {import('../../structures/client.js')} Client
 * @param {import('discord.js').Message} message
 * @param {String[]} args
 */
module.exports = async (Client, message, args) => {
  if (!message.member.hasPermission('MANAGE_GUILD')) return Client.functions.get('noPerms')(message, ['Manage Server']);

  if (!args[1]) return Client.functions.get('argMissing')(message.channel, 1, 'the channel that the giveaway message is in');
  const channel = Client.getObj(args[1], { guild: message.guild, type: 'channel' });
  if (!channel) return Client.functions.get('argFix')(Client, message.channel, 1, 'The channel provided was invalid.');
  if (!Client.checkClientPerms(channel, 'VIEW_CHANNEL', 'READ_MESSAGE_HISTORY')) return Client.functions.get('noClientPerms')(message, ['View Channels', 'Read Message History'], channel);

  if (!args[2]) return Client.functions.get('argMissing')(message.channel, 2, 'a message ID that the reactions are held in');
  const msg = await channel.messages.fetch(args[2]).catch(() => 'failed');
  if (!msg || msg === 'failed') return Client.functions.get('argFix')(Client, message.channel, 2, 'I could not find a message with the provided ID, make sure the message is in the provided channel (argument #1).');

  const reaction = msg.reactions.get('🎉');
  reaction ? await reaction.users.fetch() : null;
  if (!reaction || reaction.users.filter(u => !u.bot).size === 0) return message.reply('No user reacted with 🎉 in that message!');

  const amt = args[3] || '1';
  if (isNaN(amt)) return Client.functions.get('argFix')(Client, message.channel, 3, 'Amount of winners was not a number.');
  if (amt > 5) return Client.functions.get('argFix')(Client, message.channel, 3, 'Amount of winners may not exceed 5.');
  if (amt < 1) return Client.functions.get('argFix')(Client, message.channel, 3, 'Amount of winners may not be below 1.');
  if (amt.includes('.')) return Client.functions.get('argFix')(Client, message.channel, 3, 'Amount of winners may not include a decimal.');

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
