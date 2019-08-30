const config = require('../config.json');
const { MessageEmbed } = require('discord.js');

module.exports = (message, argNum, desc) => {
  if (!message.channel.permissionsFor(message.guild.me).has('EMBED_LINKS')) return message.channel.send(`:x: Argument **#${argNum}** was invalid. Here's what was wrong with it.\n\n**${desc}**`);

  const embed = new MessageEmbed()
    .setColor(config.embedColor)
    .setDescription(`Argument #${argNum} is invalid. Here's what was wrong with it.\n\n**${desc}**`)
    .setFooter(`Executed by ${message.author.tag}`, message.author.displayAvatarURL())
    .setTimestamp()
    .setTitle(`Argument #${argNum} Incorrect`);

  return message.channel.send(embed);
};
