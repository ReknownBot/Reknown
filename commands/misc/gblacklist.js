/**
 * @param {import('../../structures/client.js')} Client
 * @param {import('discord.js').Message} message
 * @param {String[]} args
 */
module.exports = async (Client, message, args) => {
  if (message.author.id !== Client.ownerID) return message.reply('Only the bot owner can use this command!');

  if (!args[1]) return message.reply('You have to provide a user to globally blacklist!');
  const user = await Client.getObj(args[1], { type: 'user' });
  if (!user) return message.reply('The user you provided was invalid!');
  if (user.id === Client.ownerID) return message.reply('Don\'t... Blacklist yourself...');

  const reason = args[2] ? args.slice(2).join(' ') : 'None';

  const exists = (await Client.sql.query('SELECT reason FROM gblacklist WHERE memberid = $1', [user.id])).rows[0];
  if (exists) return message.reply('That user is already globally blacklisted!');

  Client.sql.query('INSERT INTO gblacklist (memberid, reason) VALUES ($1, $2)', [user.id, reason]);
  return message.channel.send(`Successfully globally blacklisted ${user.tag}.`);
};

module.exports.help = {
  name: 'gblacklist',
  desc: 'Blacklists a user globally from the bot.',
  category: 'misc',
  usage: '?gblacklist <User> <Reason>',
  aliases: ['gbl']
};
