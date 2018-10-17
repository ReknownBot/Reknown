module.exports = async (Client, message, args) => {
  if (!await Client.checkPerms('set', 'level', message.member)) return message.reply(':x: Sorry, but you do not have the `level.set` permission.');

  if (!args[1]) return message.reply('You have to provide a member for me to set points for!');
  const member = message.guild.members.get(args[1].replace(/[<>@!?]/g, ''));
  if (!member) return message.reply('The member you provided was invalid!');
  if (member === message.member && message.member !== message.guild.owner) return message.reply('You cannot set a level for yourself!');
  if (member.roles.highest.position >= message.member.roles.highest.position && message.member !== message.guild.owner) return message.reply('Your role position is not high enough for that member!');
  if (member === message.guild.owner && message.member !== message.guild.owner) return message.reply('You cannot set a level for the owner!');

  if (!args[2]) return message.reply('You have to provide a new amount of points!');
  const amt = args[2];
  if (isNaN(amt)) return message.reply('That is not a number!');
  if (amt < 1) return message.reply('The amount cannot be lower than 1!');
  if (amt > 25000000) return message.reply('The amount cannot exceed twenty-five million!');
  if (amt.includes('.')) return message.reply('The amount cannot be a decimal!');

  const exists = (await Client.sql.query('SELECT * FROM scores WHERE userid = $1 AND guildid = $2', [member.id, message.guild.id])).rows[0];
  if (exists) Client.sql.query('UPDATE scores SET level = $1, points = $2 WHERE userid = $3 AND guildid = $4', [Math.floor(0.2 * Math.sqrt(amt)), amt, member.id, message.guild.id]);
  else Client.sql.query('INSERT INTO scores (guildid, userid, level, points) VALUES ($1, $2, $3, $4)', [message.guild.id, member.id, Math.floor(0.2 * Math.sqrt(amt)), amt]);

  return message.channel.send(`Successfully changed ${member.user.tag}'s points to ${amt}, which resulted in ${Math.floor(0.2 * Math.sqrt(amt))} levels.`);
};

module.exports.help = {
  name: 'setpoints',
  desc: 'Sets the points of a member.',
  category: 'mod',
  usage: '?setpoints <Member> <Amount>',
  aliases: ['setpoint']
};
