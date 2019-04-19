/**
 * @param {import('../../structures/client.js')} Client
 * @param {import('discord.js').Message} message
 * @param {String[]} args
 */
module.exports = async (Client, message, args) => {
  if (!Client.checkClientPerms(message.channel, 'EMBED_LINKS')) return Client.functions.get('noClientPerms')(message, ['Embed Links'], message.channel);

  const seconds = Math.floor((Client.bot.uptime / 1000) % 60);
  const minutes = Math.floor((Client.bot.uptime / 1000 / 60) % 60);
  const hours = Math.floor((Client.bot.uptime / 1000 / 60 / 60) % 24);
  const days = Math.floor(Client.bot.uptime / 1000 / 60 / 60 / 24);
  const contributors = await Promise.all(Client.contributors.map(async id => await Client.getObj(id, { type: 'user' }).then(u => u.tag)));

  const embed = new Client.Discord.MessageEmbed()
    .setTitle('Bot Information')
    .setColor(0x00FFFF)
    .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL())
    .addField('Owner', (await Client.bot.users.fetch(Client.ownerID)).tag, true)
    .addField('Contributors', contributors.list(), true)
    .addField('Donate', '[Patreon](https://www.patreon.com/Jyguy)\n[PayPal](https://paypal.me/jyguy)', true)
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
