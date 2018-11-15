module.exports = async (Client, message, args) => {
  const seconds = Math.floor((Client.bot.uptime / 1000) % 60);
  const minutes = Math.floor((Client.bot.uptime / 1000 / 60) % 60);
  const hours = Math.floor((Client.bot.uptime / 1000 / 60 / 60) % 24);
  const days = Math.floor(Client.bot.uptime / 1000 / 60 / 60 / 24);
  const contributors = (await Promise.all(Client.contributors.map(async id => (await Client.bot.users.fetch(id)).tag))).list();

  const embed = new Client.Discord.MessageEmbed()
    .setTitle('Bot Information')
    .setColor(0x00FFFF)
    .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL())
    .addField('Owner', (await Client.bot.users.fetch('288831103895076867')).tag, true)
    .addField('Contributors', contributors, true)
    .addField('Donate', '[PayPal](https://paypal.me/jyguy)', true)
    .addField('Support', '[Here](https://discord.gg/n45fq9K)', true)
    .addField('Uptime', `${days} days, ${hours} hours, ${minutes} minutes, and ${seconds} seconds.`);

  return message.channel.send(embed);
};

module.exports.help = {
  name: 'botinfo',
  desc: 'Displays information about the bot.',
  category: 'misc',
  usage: '?botinfo',
  aliases: ['binfo', 'info']
};
