/* eslint-disable no-unneeded-ternary */

module.exports = async (Client, message, args) => {
  if (!args[1]) return message.reply('You have to provide a member for me to search!');
  const member = message.guild.members.get(args[1].replace(/[<>@!?]/g, ''));
  if (!member) return message.reply('The member you provided was invalid!');

  if (!args[2]) return message.reply('You have to include a message amount for me to search!');
  let amt = args[2];
  if (isNaN(amt)) return message.reply('The message amount you provided was not a number!');
  if (amt > 500) return message.reply('The message amount should __not__ exceed 500!');
  if (amt < 1) return message.reply('The message amount should __not__ be lower than 1!');
  if (amt.includes('.')) return message.reply('The message amount should __not__ be a decimal!');

  const max = Math.ceil(amt / 100);
  let arr = [];
  let num = 0;
  let lastID;
  for (let i = 0; i < max; i++) {
    let msgs;
    if (amt > 100) {
      msgs = await message.channel.messages.fetch({
        limit: 100,
        before: lastID ? lastID : null
      });
    } else {
      msgs = await message.channel.messages.fetch({
        limit: amt,
        before: lastID ? lastID : null
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
        arr.push(`\`${num}. ${Client.escapeMarkdown(m.content)}\``);
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
