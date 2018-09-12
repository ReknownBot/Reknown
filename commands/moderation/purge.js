module.exports = async (Client, message, args) => {
  if (!await Client.checkPerms('purge', 'mod', message.member)) return message.reply(':x: Sorry, but you do not have the `mod.purge` permission.');
  if (!Client.checkClientPerms(message.channel, 'MANAGE_MESSAGES')) return message.reply('I do not have enough permissions!');

  const amount = args[1];
  if (!amount) return message.reply('Please provide an amount for me to purge.');
  if (isNaN(amount)) return message.reply('That is not a number!');
  if (amount < 1) return message.reply('You may not purge less than one!');
  if (amount > 99) return message.reply('You may not purge more than 99!');
  if (amount.includes('.')) return message.reply('I cannot purge decimals!');

  if (args[2]) {
    const member = message.guild.members.get(args[2] ? args[2].replace(/[<>@!?]/g, '') : null);
    if (!member) return message.reply('That is not a valid member!');
    let messages = await message.channel.messages.fetch({
      limit: parseInt(amount) + 1
    });
    messages = messages.filter(m => m.author.id === member.id);
    if (messages.size === 0) return message.reply('I did not find any recent messages from that user.');
    return message.channel.bulkDelete(messages, true);
  } else {
    return message.channel.bulkDelete(parseInt(amount) + 1, true);
  }
};

module.exports.help = {
  name: 'purge',
  desc: 'Purges a certain amount of messages.',
  category: 'moderation',
  usage: '?purge <Amount> [Member]',
  aliases: ['pur', 'clear', 'prune']
};
