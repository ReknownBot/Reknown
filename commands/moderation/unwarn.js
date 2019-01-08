module.exports = async (Client, message, args) => {
  if (!await Client.checkPerms('unwarn', 'mod', message.member)) return message.reply(':x: Sorry, but you do not have the `mod.unwarn` permission.');

  if (!args[1]) return message.reply('You have to supply a member for me to unwarn!');
  const member = Client.getObj(args[1], { guild: message.guild, type: 'member' });
  if (!member) return message.reply('That is not a valid member!');

  const warnid = args[2];
  if (!args[2]) return message.reply(`You have to supply a warn ID! Use \`?warnings @${member.user.tag}\` to view the warn IDs.`);
  if (isNaN(warnid)) return message.reply('That is not a number!');
  if (warnid < 1) return message.reply('The warn ID cannot be lower than 1!');

  const row = (await Client.sql.query('SELECT * FROM warnings WHERE userid2 = $1 AND warnid = $2', [member.id + message.guild.id, warnid])).rows[0];
  if (!row) return message.reply('That warning ID is incorrect!');

  Client.sql.query('DELETE FROM warnings WHERE userid2 = $1 AND warnid = $2', [member.id + message.guild.id, warnid]);
  return message.channel.send(`Successfully deleted a warning from ${member.user.tag} by the warn ID of **${warnid}**.`);
};

module.exports.help = {
  name: 'unwarn',
  desc: 'Removes a warning from a user.',
  category: 'moderation',
  usage: '?unwarn <Member> <Warn ID>',
  aliases: ['deletewarn', 'dwarn']
};
