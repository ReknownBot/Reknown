/**
 * @param {import('../../structures/client.js')} Client
 * @param {import('discord.js').Message} message
 * @param {String[]} args
*/
module.exports = async (Client, message, args) => {
  if (!await Client.checkPerms('unmute', 'mod', message.member)) return Client.functions.get('noCustomPerm')(message, 'mod.unmute');
  if (!message.guild.me.hasPermission('MANAGE_ROLES')) return Client.functions.get('noClientPerms')(message, ['Manage Roles']);

  const muteRole = message.guild.roles.find(r => r.name.toLowerCase() === 'muted');
  if (!muteRole) return message.reply('I did not find a "Muted" role!');

  if (!args[1]) return Client.functions.get('argMissing')(message.channel, 1, 'a member to unmute');
  const member = Client.getObj(args[1], { guild: message.guild, type: 'member' });
  if (!member) return Client.functions.get('argFix')(Client, message.channel, 1, 'Did not find a member with that query.');
  if (member === message.member) return message.reply('You cannot unmute yourself!');
  if (member.roles.highest.position >= message.member.roles.highest.position && message.member !== message.guild.owner) return message.reply('You cannot unmute ones that have a higher role than you!');
  if (!member.roles.has(muteRole.id)) return Client.functions.get('argFix')(Client, message.channel, 1, 'That member is not muted.');

  Client.sql.query('DELETE FROM mute WHERE userid = $1 AND guildid = $2', [member.id, message.guild.id]);
  clearTimeout(Client.mutes.get(member.id));
  Client.mutes.delete(member.id);
  member.roles.remove(muteRole);
  return message.channel.send(`Successfully unmuted ${member.user.tag} (${member.id}).`);
};

module.exports.help = {
  name: 'unmute',
  desc: 'Unmutes a muted member.',
  category: 'moderation',
  usage: '?unmute <Member>',
  aliases: ['unsilence']
};
