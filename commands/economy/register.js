module.exports = async (Client, message, args) => {
  const registered = (await Client.sql.query('SELECT * FROM economy WHERE userid = $1', [message.author.id])).rows[0];
  if (registered) return message.reply('You are already registered!');

  Client.sql.query('INSERT INTO economy (money, userid) VALUES ($1, $2)', [0, message.author.id]);
  return message.channel.send('You successfully registered into the economy system.');
};

module.exports.help = {
  name: 'register',
  desc: 'Registers your account into the economy system.',
  category: 'economy',
  usage: '?register',
  aliases: []
};
