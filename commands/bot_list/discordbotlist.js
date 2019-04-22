/**
 * @param {import('../../structures/client.js')} Client
 * @param {import('discord.js').Message} message
 * @param {String[]} args
 */
module.exports = async (Client, message, args) => {
  if (!args[1]) return Client.functions.get('argMissing')(message.channel, 1, 'a bot to search for');
  if (!Client.checkClientPerms(message.channel, 'EMBED_LINKS')) return Client.functions.get('noClientPerms')(message, ['Embed Links'], message.channel);
  const bot = args[1].replace(/[<>@!?]/g, '');

  const body = await Client.fetch(`https://discordbots.org/api/bots/${bot}`, {
    headers: {
      'Authorization': process.env.DBL_API_KEY
    }
  }).then(res => res.json());

  if (body.error === 'Not Found') return Client.functions.get('argFix')(message.channel, 1, 'Did not find a bot with that query on discordbots.org.');

  /** @type {String[]} */
  const owners = await Promise.all(body.owners.map(id => Client.getObj(id, { type: 'user' }).then(u => u.tag)));
  const invite = body.invite || 'Not Specified';
  const website = body.website || 'None';
  const botTag = `${body.username}#${body.discriminator} (${body.id})`;
  const certified = body.certified ? 'True' : 'False';
  const tags = body.tags.list();
  const library = body.lib;
  const shortDesc = body.shortdesc.length > 2048 ? 'Over 2048 Char.' : body.shortdesc;

  const embed = new Client.Discord.MessageEmbed()
    .setTitle(botTag)
    .setURL(`https://discordbots.org/bot/${bot}`)
    .setColor(0x00FFFF)
    .setDescription(shortDesc)
    .addField('Owners', owners.list(), true)
    .addField('Certified', certified, true)
    .addField('Discord Invite', invite, true)
    .addField('Tags', tags, true)
    .addField('Library', library, true)
    .addField('Website', website, true);

  return message.channel.send(embed);
};

module.exports.help = {
  name: 'discordbotlist',
  desc: 'Displays information of a bot in discordbots.org.',
  category: 'bot list',
  usage: '?discordbotlist <Bot>',
  aliases: ['dbl']
};
