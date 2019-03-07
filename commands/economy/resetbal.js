/**
 * @param {import('../../structures/client.js')} Client
 * @param {import('discord.js').Message} message
 * @param {String[]} args
 */
module.exports = async (Client, message, args) => {
  if (message.author.id !== '288831103895076867') return message.reply('Only the bot owner may use this command!');

  if (!args[1]) return message.reply('You have to provide a user for me to reset their economy system!');
  const user = await Client.getObj(args[1], { type: 'user' });
  if (!user) return message.reply('The user you provided was invalid!');

  const ecoRow = (await Client.sql.query('SELECT * FROM economy WHERE userid = $1', [user.id])).rows[0];
  if (!ecoRow) return message.reply(`The member ${Client.escMD(user.tag)} is not registered into the economy system yet!`);

  Client.sql.query('DELETE FROM economy WHERE userid = $1', [user.id]);
  return message.channel.send(`Successfully reset ${Client.escMD(user.tag)}'s economy.`);
};

module.exports.help = {
  name: 'resetbal',
  desc: 'Resets a user\'s economy system. (Removes Registration)',
  category: 'economy',
  usage: 'resetbal <User>',
  aliases: ['resetmoney']
};

module.exports.private = true;
