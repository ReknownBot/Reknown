/**
 * @param {import('../../structures/client.js')} Client
 * @param {import('discord.js').Message} message
 * @param {String[]} args
 */
module.exports = async (Client, message, args) => {
  const ecoRow = (await Client.sql.query('SELECT money FROM economy WHERE userid = $1', [message.author.id])).rows[0];
  if (!ecoRow) return message.reply(`You need to be registered to use this command! Use \`${Client.prefixes[message.guild.id]}register\` to do so.`);

  if (!args[1]) return message.reply('You have to provide an amount to gamble!');
  const amt = args[1];
  if (isNaN(amt)) return message.reply('The amount you provided is not a number!');
  if (amt.includes('.')) return message.reply('The amount cannot be a decimal!');
  if (amt > ecoRow.money) return message.reply('You do not have enough money!');
  if (amt < 10) return message.reply('The amount needs to be at least 10!');
  if (amt > 5000) return message.reply('The maximum amount of credits you can gamble is 5,000!');

  const won = Math.random() < 0.5;
  if (won) {
    Client.sql.query('UPDATE economy SET money = money + $1 WHERE userid = $2', [amt, message.author.id]);
    return message.channel.send(`You won! **${amt} Credits** were added to your account.`);
  } else {
    Client.sql.query('UPDATE economy SET money = money - $1 WHERE userid = $2', [amt, message.author.id]);
    return message.channel.send(`You lost! **${amt} Credits** were removed from your account.`);
  }
};

module.exports.help = {
  name: 'gamble',
  desc: 'Gambles an amount of credits. Minimum is 10 credits, maximum is 5,000.',
  category: 'economy',
  usage: '?gamble <Amount>',
  aliases: []
};
