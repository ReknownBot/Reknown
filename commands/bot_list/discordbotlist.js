module.exports = async (Client, message, args) => {
  if (!args[1]) return message.reply('You have to provide a bot for me to search!');
  const bot = args[1].replace(/[<>@!?]/g, '');

  const dblClient = new Client.dbl({
    token: process.env.DBL_API_KEY,
    id: message.client.user.id
  });

  dblClient.getBot(bot, async (err, res) => {
    if (err) {
      if (err != 'Error: Got HTTP Code 404') throw new Error(err);
      return message.reply('I did not find a bot with that ID.');
    }
    if (res.vanity === bot) return message.reply('I did not find a bot with that ID.');

    let ownerArr = res.owners.map(async owner => {
      return (await message.client.users.fetch(owner)).tag;
    });
    ownerArr = await Promise.all(ownerArr);

    if (res.longdesc.length > 2048) res.longdesc = 'Too long to display';
    const regex = new RegExp('<html>', 'g');
    if (regex.test(res.longdesc)) res.longdesc = 'HTML Designed';

    const embed = new Client.Discord.MessageEmbed()
      .setColor(0x00FFFF)
      .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL())
      .setAuthor(`${res.username}#${res.discriminator}'s DBL Info`)
      .setTitle('Detailed Description')
      .setDescription(res.longdesc.length <= 2048 ? res.longdesc : 'Too long to display')
      .addField('Brief Description', res.shortdesc)
      .addField('Invite', res.invite, true)
      .addField('Library', res.lib, true)
      .addField('Upvotes', res.points, true)
      .addField('Certified', res.certifiedBot, true)
      .addField('Owner(s)', ownerArr.list(), true)
      .addField('Tag(s)', res.tags[0] ? res.tags.list() : 'None')
      .addField('Prefix', res.prefix, true);

    res.guilds[0] ? embed.addField('Guilds', res.guilds.list(), true) : null;
    res.vimeo ? embed.addField('Vimeo', res.vimeo, true) : null;
    res.invite ? embed.addField('Support Server', `https://discord.gg/${res.support}`, true) : null;

    return message.channel.send(embed);
  });
};

module.exports.help = {
  name: 'discordbotlist',
  desc: 'Displays information of a bot in discordbots.org.',
  category: 'bot list',
  usage: '?discordbotlist <Bot ID or Mention>',
  aliases: ['dbl']
};
