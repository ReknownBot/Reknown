module.exports = async (Client, message, args) => {
  if (!await Client.checkPerms('unblacklist', 'mod', message.member)) return message.reply(':x: Sorry, but you do not have the `mod.unblacklist` permission.');

  if (!args[1]) return message.reply('You have to provide a member for me to blacklist!');
  const member = Client.getObj(args[1], { guild: message.guild, type: 'member' });
  if (!member) return message.reply('That is not a valid member!');
  if (member.roles.highest.position >= message.member.roles.highest.position && message.member !== message.guild.owner) return message.reply('Your role position is not high enough!');

  const blacklisted = (await Client.sql.query('SELECT * FROM blacklist WHERE guildid = $1 AND userid = $2', [message.guild.id, member.id])).rows[0];
  if (!blacklisted) return message.reply('That member is not blacklisted!');

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
