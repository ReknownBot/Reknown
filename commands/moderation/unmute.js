module.exports = async (Client, message, args) => {
  if (!await Client.checkPerms('unmute', 'mod', message.member)) return message.reply(':x: Sorry, but you do not have the `mod.unmute` permission.');

  const muteRole = message.guild.roles.find(r => r.name.toLowerCase() === 'muted');
  if (!muteRole) return message.reply('I did not find a "Muted" role!');

  if (!args[1]) return message.reply('You have to provide a member for me to unmute!');
  const member = message.guild.members.get(args[1].replace(/[<>@!?]/g, ''));
  if (!member) return message.reply('The member you provided was invalid!');
  if (member === message.member) return message.reply('You cannot unmute yourself!');
  if (member.roles.highest.position >= message.member.roles.highest.position && message.member !== message.guild.owner) return message.reply('You cannot unmute ones that have a higher role than you!');
  if (!member.roles.has(muteRole.id)) return message.reply('That member is not muted!');

  Client.sql.query('DELETE FROM mute WHERE guildid = $1 AND memberid = $2', [message.guild.id, member.id]);
  member.roles.remove(muteRole);
  return message.channel.send(`Successfully unmuted ${member.user.tag} (${member.id}).`);
};

module.exports.help = {
  name: 'unmute',
  desc: 'Unmutes a muted member.',
  category: 'mod',
  usage: '?unmute <Member>',
  aliases: ['unsilence']
};
