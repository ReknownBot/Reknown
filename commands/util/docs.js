/**
 * @param {import('../../structures/client.js')} Client
 * @param {import('discord.js').Message} message
 * @param {String[]} args
*/
module.exports = async (Client, message, args) => {
  if (!Client.checkClientPerms(message.channel, 'EMBED_LINKS')) return Client.functions.get('noClientPerms')(message, ['Embed Links'], message.channel);
  if (!args[1]) return Client.functions.get('argMissing')(message.channel, 1, 'a query to search the docs with');

  const branch = args[2] ? args.pop() : 'stable';
  if (!['stable', 'master'].includes(branch)) return Client.functions.get('argFix')(Client, message.channel, 2, 'The branch name must be either `stable` or `master`.');

  const query = args.slice(1).join(' ').replace('#', '.');

  const body = await Client.fetch(`https://djsdocs.sorta.moe/main/${branch}/embed?q=${query}`).then(res => res.json());
  if (!body) return Client.functions.get('argFix')(Client, message.channel, 1, 'Did not find anything with that query.');

  return message.channel.send({ embed: body });
};

module.exports.help = {
  name: 'docs',
  desc: 'A documentation command for Discord.js.',
  category: 'util',
  usage: '?docs <Query> [Branch]',
  aliases: ['doc']
};
