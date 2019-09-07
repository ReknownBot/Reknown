const qs = require('querystring');
const sources = [
  'stable',
  'master',
  'rpc',
  'commando',
  'akairo',
  'akairo-master',
  '11.5-dev'
];

module.exports.run = async (client, message, args) => {
  if (!message.channel.permissionsFor(client.user).has('EMBED_LINKS')) return client.functions.noClientPerms(message, [ 'Embed Links' ], message.channel);

  const q = args[1];
  let branch = args[2] || 'stable';
  if (!q) return client.functions.noArg(message, 1, 'a query to search for.');
  if (!sources.includes(branch.toLowerCase())) return client.functions.badArg(message, 2, `The source provided was invalid. It can be ${sources.join(', ')}.`);
  branch = branch.toLowerCase();
  if (branch === '11.5-dev') branch = `https://raw.githubusercontent.com/discordjs/discord.js/docs/${branch}.json`;

  const qstring = qs.stringify({ q: q, src: branch });
  const embed = await client.fetch(`https://djsdocs.sorta.moe/v2/embed?${qstring}`).then(res => res.json());
  if (!embed) return client.functions.badArg(message, 1, 'I did not find anything with that query.');
  return message.channel.send({ embed: embed });
};

module.exports.help = {
  aliases: [],
  category: 'Documentation',
  desc: 'Displays documentation for Discord.JS.',
  usage: 'docs <Query> [Branch]'
};
