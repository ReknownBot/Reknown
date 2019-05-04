/**
 * @param {import('../../structures/client.js')} Client
 * @param {import('discord.js').Message} message
 * @param {String[]} args
*/
module.exports = async (Client, message, args) => {
  if (!await Client.checkPerms('kick', 'mod', message.member)) return Client.functions.get('noCustomPerm')(message, 'mod.kick');
  if (!message.guild.me.hasPermission('KICK_MEMBERS')) return Client.functions.get('noClientPerms')(message, ['Kick Members']);

  if (!args[1]) return Client.functions.get('argMissing')(message.channel, 1, 'a member to kick');

  const member = await Client.getObj(args[1], { guild: message.guild, type: 'member' });
  if (!member) return Client.functions.get('argFix')(Client, message.channel, 1, 'The member provided was invalid.');
  if (message.guild.owner === member) return message.reply('I cannot kick an owner!');
  if (message.member === member) return message.reply('You cannot kick yourself!');
  if (member.roles.highest.position >= message.member.roles.highest.position && message.member !== message.guild.owner) return message.reply('Your role position is not high enough!');
  if (member.roles.highest.position >= message.guild.me.roles.highest.position) return message.reply('My role position is not high enough to kick that user!');

  const reason = args.slice(2).join(' ');
  member.kick(reason);

  return message.channel.send(`Successfully kicked ${member.user.tag}${reason ? ` for ${reason}` : '.'}`);
};

module.exports.help = {
  name: 'kick',
  desc: 'Kicks a member.',
  category: 'moderation',
  usage: '?kick <Member> [Reason]',
  aliases: []
};
