module.exports = async (Client, message, args) => {
  if (!await Client.checkPerms('unban', 'mod', message.member)) return message.reply(':x: Sorry, but you do not have the `mod.unban` permission.');
  if (!Client.checkClientPerms(message.channel, 'BAN_MEMBERS')) return message.reply('I do not have enough permissions to unban a member! Please make sure I have the `Ban Members` permission.');

  if (!args[1]) return message.reply('You have to provide a member for me to unban!');

  const user = Client.getObj(args[1], { type: 'user' });
  if (!user) return message.reply('The user you provided was invalid. Make sure it\'s a valid ID!');

  const bans = await message.guild.fetchBans();
  if (!bans.has(user.id)) return message.reply('That user is not banned!');

  message.guild.members.unban(user, args[2] ? args.slice(2).join(' ') : 'None');
  return message.channel.send(`Successfully unbanned ${user.tag}${args[2] ? `for ${args.slice(2).join(' ')}` : ''}.`);
};

module.exports.help = {
  name: 'unban',
  desc: 'Unbans a member via ID.',
  category: 'moderation',
  usage: '?unban <ID> [Reason]',
  aliases: []
};
