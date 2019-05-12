/**
 * @param {import('../../structures/client.js')} Client
 * @param {import('discord.js').Message} message
 * @param {String[]} args
*/
module.exports = async (Client, message, args) => {
  if (!Client.checkClientPerms(message.channel, 'EMBED_LINKS')) return Client.functions.get('noClientPerms')(message, ['Embed Links'], message.channel);

  const embed = new Client.Discord.MessageEmbed()
    .setTitle(`Total Member Count in ${message.guild.name}`)
    .setColor(0x00FFFF)
    .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL())
    .addField('Total', Client.formatNum(message.guild.memberCount), true)
    .addField('Humans', Client.formatNum(message.guild.members.filter(m => !m.user.bot).size), true)
    .addField('Bots', Client.formatNum(message.guild.members.filter(m => m.user.bot).size), true);

  return message.channel.send(embed);
};

module.exports.help = {
  name: 'membercount',
  desc: 'Displays the amount of members on the server.',
  category: 'util',
  usage: '?membercount',
  aliases: ['mcount']
};
