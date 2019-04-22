/**
 * @param {import('../../structures/client.js')} Client
 * @param {import('discord.js').Message} message
 * @param {String[]} args
*/
module.exports = async (Client, message, args) => {
  if (!await Client.checkPerms('purge', 'mod', message.member)) return Client.functions.get('noCustomPerm')(message, 'mod.purge');
  if (!Client.checkClientPerms(message.channel, 'MANAGE_MESSAGES')) return Client.functions.get('noClientPerms')(message, ['Manage Messages'], message.channel);

  let amount = args[1];
  if (!amount) return Client.functions.get('argMissing')(message.channel, 1, 'an amount to purge');
  if (isNaN(amount)) return Client.functions.get('argFix')(Client, message.channel, 1, 'The argument was not a number.');
  if (amount < 2) return Client.functions.get('argFix')(Client, message.channel, 1, 'The amount cannot be lower than 2.');
  if (amount > 100) return Client.functions.get('argFix')(Client, message.channel, 1, 'The amount may not be above 100.');
  if (amount.includes('.')) return Client.functions.get('argFix')(Client, message.channel, 1, 'The amount may not include a decimal.');
  amount = parseInt(amount);

  if (args[2]) {
    const member = Client.getObj(args[2], { guild: message.guild, type: 'member' });
    if (!member) return Client.functions.get('argFix')(Client, message.channel, 2, 'Did not find a member with that query.');
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
