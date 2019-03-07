/**
 * @param {import('../../structures/client.js')} Client
 * @param {import('discord.js').Message} message
 * @param {String[]} args
*/
module.exports = async (Client, message, args) => {
  if (message.author.id !== '288831103895076867') return message.reply('Only the bot owner can use this command!');

  if (!args[1]) return message.reply('You have to provide a user to remove a global blacklist!');
  const user = await Client.getObj(args[1], { type: 'user' });
  if (!user) return message.reply('The user you provided was invalid!');

  const exists = (await Client.sql.query('SELECT reason FROM gblacklist WHERE memberid = $1', [user.id])).rows[0];
  if (!exists) return message.reply('That user is not globally blacklisted!');

  Client.sql.query('DELETE FROM gblacklist WHERE memberid = $1 LIMIT 1', [user.id]);
  return message.channel.send(`Successfully removed a global blacklist from ${user.tag}.`);
};

module.exports.help = {
  name: 'gunblacklist',
  desc: 'Removes a global blacklist from a user.',
  category: 'misc',
  usage: '?gunblacklist <User>',
  aliases: ['gubl']
};
