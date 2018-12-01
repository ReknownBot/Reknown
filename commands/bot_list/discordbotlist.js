module.exports = async (Client, message, args) => {
  if (!args[1]) return message.reply('You have to provide a bot for me to search!');
  if (!Client.checkClientPerms(message.channel, 'EMBED_LINKS')) return message.reply('I do not have enough permissions to embed links in this channel! Please make sure I have that permission in order to use this command.');
  const bot = args[1].replace(/[<>@!?]/g, '');

  Client.request({
    url: `https://discordbots.org/api/bots/${bot}`,
    headers: {
      'Authorization': process.env.DBL_API_KEY
    }
  }, async (err, res, body) => {
    if (err) throw new Error(err);
    body = JSON.parse(body);
    if (body.error === 'Not Found') return message.reply('The bot you provided was not in discordbots.org!');

    const owners = await Promise.all(body.owners.map(async id => message.client.users.fetch(id).then(u => u.tag)));
    const invite = body.invite || 'Not Specified';
    const website = body.website || 'None';
    const botTag = `${body.username}#${body.discriminator} (${body.id})`;
    const certified = body.certified ? 'True' : 'False';
    const tags = body.tags.list();
    const library = body.lib;
    const shortDesc = body.shortdesc.length > 2048 ? 'Over 2048 Char.' : body.shortdesc;

    const embed = new Client.Discord.MessageEmbed()
      .setTitle(botTag)
      .setURL('https://discordbots.org/bot/338832551278018581')
      .setColor(0x00FFFF)
      .setDescription(shortDesc)
      .addField('Owners', owners.list(), true)
      .addField('Certified', certified, true)
      .addField('Discord Invite', invite, true)
      .addField('Tags', tags, true)
      .addField('Library', library, true)
      .addField('Website', website, true);

    return message.channel.send(embed);
  });
};

module.exports.help = {
  name: 'discordbotlist',
  desc: 'Displays information of a bot in discordbots.org.',
  category: 'bot list',
  usage: '?discordbotlist <Bot>',
  aliases: ['dbl']
};
