/**
 * @param {import('../../structures/client.js')} Client
 * @param {import('discord.js').Message} message
 * @param {String[]} args
*/
module.exports = async (Client, message, args) => {
  if (!args[1]) return Client.functions.get('argMissing')(message.channel, 1, 'a member to search with');
  const member = message.guild.members.get(args[1].replace(/[<>@!?]/g, ''));
  if (!member) return Client.functions.get('argFix')(Client, message.channel, 1, 'Did not find a member with that query.');

  if (!args[2]) return Client.functions.get('argMissing')(message.channel, 2, 'an amount of messages to search for');
  const amt = args[2];
  if (isNaN(amt)) return Client.functions.get('argFix')(Client, message.channel, 2, 'The amount must be a number.');
  if (amt > 100) return Client.functions.get('argFix')(Client, message.channel, 2, 'The amount may not exceed 100.');
  if (amt < 1) return Client.functions.get('argFix')(Client, message.channel, 2, 'The amount may not be lower than 1.');
  if (amt.includes('.')) return Client.functions.get('argFix')(Client, message.channel, 2, 'The amount may not include a decimal.');

  const msgs = await message.channel.messages.fetch({
    limit: amt
  });

  const sorted = msgs.filter(m => m.author.id === member.id).sort((a, b) => {
    if (a.createdTimestamp > b.createdTimestamp) {
      return -1;
    } else if (a.createdTimestamp < b.createdTimestamp) {
      return 1;
    }
    return 0;
  });

  if (sorted.size === 0) return message.reply('I did not find anything!');

  let num = 0;
  const msg = sorted.map(m => {
    num += 1;
    return `\`${num}. ${Client.escMD(m.content)}\``;
  });
  if (msg.length > 2048) return message.reply('The result is too large for me to send. Try toning down the limit for searching.');
  return message.channel.send(msg);
};

module.exports.help = {
  name: 'search',
  desc: 'Searches a user\'s recent message history!',
  category: 'util',
  usage: '?search <Member> <Message Amount>',
  aliases: ['history']
};
