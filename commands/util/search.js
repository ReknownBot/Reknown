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
  let amt = args[2];
  if (isNaN(amt)) return Client.functions.get('argFix')(Client, message.channel, 2, 'The amount must be a number.');
  if (amt > 500) return Client.functions.get('argFix')(Client, message.channel, 2, 'The amount may not exceed 500.');
  if (amt < 1) return Client.functions.get('argFix')(Client, message.channel, 2, 'The amount may not be lower than 1.');
  if (amt.includes('.')) return Client.functions.get('argFix')(Client, message.channel, 2, 'The amount may not include a decimal.');

  const max = Math.ceil(amt / 100);
  const arr = [];
  let num = 0;
  let lastID;
  for (let i = 0; i < max; i++) {
    let msgs;
    if (amt > 100) {
      msgs = await message.channel.messages.fetch({
        limit: 100,
        before: lastID
      });
    } else {
      msgs = await message.channel.messages.fetch({
        limit: amt,
        before: lastID
      });
    }

    const messages = msgs.filter(m => m.author.id === member.id).sort((a, b) => {
      // Message Created after
      if (a.createdTimestamp > b.createdTimestamp) {
        return -1;
      } else if (a.createdTimestamp < b.createdTimestamp) {
        return 1;
      }
      // Very slim chance of happening
      return 0;
    });
    lastID = messages.last() ? messages.last().id : null;
    messages.forEach(m => {
      if (m.author.id === member.id) {
        num++;
        arr.push(`\`${num}. ${Client.escMD(m.content)}\``);
      }
    });
    amt -= 100;
  }

  if (arr.length === 0) return message.reply('I did not find anything!');
  return message.channel.send(arr, {
    split: true
  });
};

module.exports.help = {
  name: 'search',
  desc: 'Searches a user\'s recent message history!',
  category: 'util',
  usage: '?search <Member> <Message Amount>',
  aliases: ['history']
};
