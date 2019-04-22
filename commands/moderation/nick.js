/**
 * @param {import('../../structures/client.js')} Client
 * @param {import('discord.js').Message} message
 * @param {String[]} args
*/
module.exports = async (Client, message, args) => {
  if (!await Client.checkPerms('nick', 'mod', message.member)) return Client.functions.get('noCustomPerm')(message, 'mod.nick');
  if (!message.guild.me.hasPermission('MANAGE_NICKNAMES')) return Client.functions.get('noClientPerms')(message, ['Manage Nicknames']);

  if (!args[1]) return Client.functions.get('argMissing')(message.channel, 1, 'a member to change the nickname of');
  const member = Client.getObj(args[1], { guild: message.guild, type: 'member' });
  if (!member) return Client.functions.get('argFix')(Client, message.channel, 1, 'Did not find a member with that query.');
  if (!member.manageable) return message.reply('I cannot nickname that member!');
  if (member.roles.highest.position >= message.member.roles.highest.position && message.member !== message.guild.owner) return message.reply('Your role position is not high enough!');

  const nickname = args.slice(2).join(' ');
  if (!nickname) return Client.functions.get('argMissing')(message.channel, 2, 'a new nickname to change to');
  if (nickname.length > 32) return Client.functions.get('argFix')(Client, message.channel, 2, 'The nickname length may not exceed 32.');
  if (nickname === member.nickname) return Client.functions.get('argFix')(Client, message.channel, 2, 'The nickname is the same as the current nickname of the member.');
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
