/**
 * @param {import('../../structures/client.js')} Client
 * @param {import('discord.js').Message} message
 * @param {String[]} args
*/
module.exports = async (Client, message, args) => {
  if (!await Client.checkPerms('unblacklist', 'mod', message.member)) return Client.functions.get('noCustomPerm')(message, 'mod.unblacklist');

  if (!args[1]) return Client.functions.get('argMissing')(message.channel, 1, 'a member to unblacklist');
  const member = await Client.getObj(args[1], { guild: message.guild, type: 'member' });
  if (!member) return Client.functions.get('argFix')(Client, message.channel, 1, 'Did not find a member with that query.');
  if (member.roles.highest.position >= message.member.roles.highest.position && message.member !== message.guild.owner) return message.reply('Your role position is not high enough!');

  const blacklisted = (await Client.sql.query('SELECT * FROM blacklist WHERE guildid = $1 AND userid = $2', [message.guild.id, member.id])).rows[0];
  if (!blacklisted) return Client.functions.get('argFix')(Client, message.channel, 1, 'That member is not blacklisted.');

  Client.sql.query('DELETE FROM blacklist WHERE guildid = $1 AND userid = $2');
  return message.channel.send(`Successfully unblacklisted ${member.user.tag}.`);
};

module.exports.help = {
  name: 'unblacklist',
  desc: 'Unblacklists a member.',
  category: 'moderation',
  usage: '?unblacklist <Member>',
  aliases: []
};
