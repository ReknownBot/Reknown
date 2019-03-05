module.exports = async (Client, message, args) => {
  if (!await Client.checkPerms('nick', 'mod', message.member)) return message.reply(':x: Sorry, but you do not have the `mod.nick` permission.');
  if (!message.guild.me.hasPermission('MANAGE_NICKNAMES')) return Client.functions.get('noClientPerms')(message, ['Manage Nicknames']);

  if (!args[1]) return message.reply('You have to provide a member for me to nickname!');
  const member = Client.getObj(args[1], { guild: message.guild, type: 'member' });
  if (!member) return message.reply('The member you provided was invalid!');
  if (!member.manageable) return message.reply('I cannot nickname that member!');
  if (member.roles.highest.position >= message.member.roles.highest.position && message.member !== message.guild.owner) return message.reply('Your role position is not high enough!');

  const nickname = args.slice(2).join(' ');
  if (!nickname) return message.reply('You have to provide a new nickname for me to set for that user!');
  if (nickname.length > 32) return message.reply('The nickname cannot exceed 32 characters!');
  if (nickname === member.nickname) return message.reply('The nickname you provided is already in use by that user!');
  member.setNickname(nickname);
  return message.channel.send(`Successfully nicknamed ${member.user.tag} to ${nickname}.`);
};

module.exports.help = {
  name: 'nick',
  desc: 'Nicknames a mentioned member.',
  category: 'moderation',
  usage: '?nick <Member> <New Nickname>',
  aliases: ['nickname', 'setnick']
};
