const request = require('request');

module.exports = async (Client, message, args) => {
  if (!Client.checkClientPerms(message.channel, 'EMBED_LINKS')) return message.reply('I need the `Embed Links` permission for this command!');
  if (!args[1]) return message.reply('You have to provide a query for me to search!');

  const branch = args[2] ? args.pop() : 'stable';
  if (!['stable', 'master'].includes(branch)) return message.reply('The branch has to be either `stable` or `master`!');

  const query = args.slice(1).join(' ').replace('#', '.');

  request(`https://djsdocs.sorta.moe/main/${branch}/embed?q=${query}`, (err, res, body) => {
    if (err) throw new Error(err);

    body = JSON.parse(body);
    if (!body) return message.reply('I did not find any results from that query.');

    const embed = body;
    return message.channel.send({ embed: embed });
  });
};

module.exports.help = {
  name: 'docs',
  desc: 'A documentation command for Discord.js.',
  category: 'util',
  usage: '?docs <Query> [Branch]',
  aliases: ['doc']
};
