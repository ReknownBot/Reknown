import { Message, TextChannel, MessageEmbed } from 'discord.js';
import { embedColor } from '../config.json';


module.exports = (message: Message, argNum: number, desc: string) => {
  if (message.channel instanceof TextChannel && !message.channel.permissionsFor(message.guild.me).has('EMBED_LINKS')) return message.channel.send(`:x: Argument **#${argNum}** was missing. It is supposed to be **${desc}**`);

  const embed = new MessageEmbed()
    .setColor(embedColor)
    .setDescription(`Argument #${argNum} is missing. It is supposed to be **${desc}**`)
    .setFooter(`Executed by ${message.author.tag}`, message.author.displayAvatarURL())
    .setTimestamp()
    .setTitle(`Argument #${argNum} Missing`);

  message.channel.send(embed);
};
