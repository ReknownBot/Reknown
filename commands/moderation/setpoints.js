/**
 * @param {import('../../structures/client.js')} Client
 * @param {import('discord.js').Message} message
 * @param {String[]} args
*/
module.exports = async (Client, message, args) => {
  if (!await Client.checkPerms('set', 'level', message.member)) return Client.functions.get('noCustomPerm')(message, 'level.set');

  if (!args[1]) return Client.functions.get('argMissing')(message.channel, 1, 'a member to set points to');
  const member = Client.getObj(args[1], { guild: message.guild, type: 'member' });
  if (!member) return Client.functions.get('argFix')(Client, message.channel, 1, 'Did not find a member with that query.');
  if (member === message.member && message.member !== message.guild.owner) return message.reply('You cannot set a level for yourself!');
  if (member.roles.highest.position >= message.member.roles.highest.position && message.member !== message.guild.owner) return message.reply('Your role position is not high enough for that member!');
  if (member === message.guild.owner && message.member !== message.guild.owner) return message.reply('You cannot set a level for the owner!');

  if (!args[2]) return Client.functions.get('argMissing')(message.channel, 2, 'an amount of points to set with');
  const amt = args[2];
  if (isNaN(amt)) return Client.functions.get('argFix')(Client, message.channel, 2, 'The amount was not a number.');
  if (amt < 1) return Client.functions.get('argFix')(Client, message.channel, 2, 'The amount may not be below 1.');
  if (amt > 25000000) return Client.functions.get('argFix')(Client, message.channel, 2, 'The amount may not exceed 25,000,000');
  if (amt.includes('.')) return Client.functions.get('argFix')(Client, message.channel, 2, 'The amount may not include a decimal.');

  const exists = (await Client.sql.query('SELECT * FROM scores WHERE userid = $1 AND guildid = $2', [member.id, message.guild.id])).rows[0];
  if (exists) Client.sql.query('UPDATE scores SET level = $1, points = $2 WHERE userid = $3 AND guildid = $4', [Math.floor(0.2 * Math.sqrt(amt)), amt, member.id, message.guild.id]);
  else Client.sql.query('INSERT INTO scores (guildid, userid, level, points) VALUES ($1, $2, $3, $4)', [message.guild.id, member.id, Math.floor(0.2 * Math.sqrt(amt)), amt]);

  return message.channel.send(`Successfully changed ${member.user.tag}'s points to ${amt}, which resulted in ${Math.floor(0.2 * Math.sqrt(amt))} levels.`);
};

module.exports.help = {
  name: 'setpoints',
  desc: 'Sets the points of a member.',
  category: 'moderation',
  usage: '?setpoints <Member> <Amount>',
  aliases: ['setpoint']
};
