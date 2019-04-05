/**
 * @param {import('../../structures/client.js')} Client
 * @param {import('discord.js').Message} message
 * @param {String[]} args
*/
module.exports = async (Client, message, args) => {
  if (!Client.checkClientPerms(message.channel, 'EMBED_LINKS')) return Client.functions.get('noClientPerms')(message, ['Embed Links'], message.channel);

  const embed = new Client.Discord.MessageEmbed()
    .setTitle(`${message.guild.name} Server Info`)
    .setColor(0x00FFFF)
    .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL())
    .setThumbnail(message.guild.iconURL)
    .addField('Member Count', message.guild.memberCount, true)
    .addField('Owner', message.guild.owner.user.tag, true)
    .addField('Server Created', Client.dateFormat(message.guild.createdAt, 'mmmm dS, yyyy, h:MM:ss TT'), true)
    .addField('Role Count', message.guild.roles.size, true)
    .addField('Channel Count', message.guild.channels.size, true)
    .addField('Standard Emoji Count', message.guild.emojis.filter(e => !e.animated).size, true)
    .addField('Animated Emoji Count', message.guild.emojis.filter(e => e.animated).size, true);

  return message.channel.send(embed);
};

module.exports.help = {
  name: 'serverinfo',
  desc: 'Displays information about the server.',
  category: 'util',
  usage: '?serverinfo',
  aliases: ['sinfo', 'guildinfo', 'ginfo']
};
