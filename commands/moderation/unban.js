/**
 * @param {import('../../structures/client.js')} Client
 * @param {import('discord.js').Message} message
 * @param {String[]} args
*/
module.exports = async (Client, message, args) => {
  if (!await Client.checkPerms('unban', 'mod', message.member)) return Client.functions.get('noCustomPerm')(message, 'mod.unban');
  if (!message.guild.me.hasPermission('BAN_MEMBERS')) return Client.functions.get('noClientPerms')(message, ['Ban Members']);

  if (!args[1]) return message.reply('You have to provide a member for me to unban!');

  const user = await Client.getObj(args[1], { type: 'user' });
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
