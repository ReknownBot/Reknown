/**
 * @param {import('../../structures/client.js')} Client
 * @param {import('discord.js').Message} message
 * @param {String[]} args
 */
module.exports = async (Client, message, args) => {
  const cooldown = (await Client.sql.query('SELECT time FROM daily WHERE userid = $1 LIMIT 1', [message.author.id])).rows[0];
  if (cooldown && Date.now() - cooldown.time < 57600000) return message.reply(`You need to wait \`${Client.functions.get('getTime')(cooldown.time, 57600000)}\` to use this command again.`);

  if (cooldown) await Client.sql.query('DELETE FROM daily WHERE userid = $1', [message.author.id]);

  const amt = Math.floor(Math.random() * 201) + 100;
  const registered = (await Client.sql.query('SELECT money FROM economy WHERE userid = $1', [message.author.id])).rows[0];
  if (!registered) return message.reply(`You haven't registered yet! Please use \`${Client.escMD(Client.prefixes[message.guild.id])}register\` to do so.`);

  Client.sql.query('UPDATE economy SET money = money + $1 WHERE userid = $2', [amt, message.author.id]);
  Client.sql.query('INSERT INTO daily (time, userid) VALUES ($1, $2)', [Date.now(), message.author.id]);

  if (amt === 300) return message.channel.send('Congratulations! You earned the maximum daily reward! (300 Credits)');
  else return message.channel.send(`You earned **${amt}** credits.`);
};

module.exports.help = {
  name: 'daily',
  desc: 'Gets your daily money. This command has 16 hours of cooldown.',
  category: 'economy',
  usage: '?daily',
  aliases: []
};
