module.exports = async (Client, message, args) => {
  if (message.author.id !== '288831103895076867') return message.reply('Only the bot owner can use this command!');

  if (!args[1]) return message.reply('You have to provide a user to globally blacklist!');
  const user = await Client.bot.users.fetch(args[1].replace(/[<>@!?]/g, '')).then(u => u).catch(() => 'failed');
  if (!user || user === 'failed') return message.reply('The user you provided was invalid!');
  if (user.id === '288831103895076867') return message.reply('Don\'t... Blacklist yourself...');

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
