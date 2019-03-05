module.exports = async (Client, message, args) => {
  if (!await Client.checkPerms('purge', 'mod', message.member)) return message.reply(':x: Sorry, but you do not have the `mod.purge` permission.');
  if (!Client.checkClientPerms(message.channel, 'MANAGE_MESSAGES')) return Client.functions.get('noClientPerms')(message, ['Manage Messages'], message.channel);

  let amount = args[1];
  if (!amount) return message.reply('Please provide an amount for me to purge.');
  if (isNaN(amount)) return message.reply('That is not a number!');
  if (amount < 2) return message.reply('You may not purge less than 2!');
  if (amount > 100) return message.reply('You may not purge more than 100!');
  if (amount.includes('.')) return message.reply('I cannot purge decimals!');
  amount = parseInt(amount);

  if (args[2]) {
    const member = Client.getObj(args[2], { guild: message.guild, type: 'member' });
    if (!member) return message.reply('That is not a valid member!');
    let messages = await message.channel.messages.fetch({
      limit: amount,
      before: message.createdTimestamp
    });
    messages = messages.filter(m => m.author.id === member.id);
    if (messages.size === 0) return message.reply('I did not find any recent messages from that user.');
    await message.delete();
    return message.channel.bulkDelete(messages, true);
  } else {
    await message.delete();
    return message.channel.bulkDelete(amount, true);
  }
};

module.exports.help = {
  name: 'purge',
  desc: 'Purges a certain amount of messages.',
  category: 'moderation',
  usage: '?purge <Amount> [Member]',
  aliases: ['pur', 'clear', 'prune']
};
