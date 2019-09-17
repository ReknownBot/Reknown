import { Message, TextChannel, MessageEmbed } from 'discord.js';
import { embedColor } from '../config.json';


module.exports = (message: Message, argNum: number, desc: string): void => {
  if (!(message.channel as TextChannel).permissionsFor(message.guild.me).has('EMBED_LINKS')) return void message.channel.send(`:x: Argument **#${argNum}** was missing. It is supposed to be **${desc}**`);

  const embed = new MessageEmbed()
    .setColor(embedColor)
    .setDescription(`Argument #${argNum} is missing. It is supposed to be **${desc}**`)
    .setFooter(`Executed by ${message.author.tag}`, message.author.displayAvatarURL())
    .setTimestamp()
    .setTitle(`Argument #${argNum} Missing`);

  message.channel.send(embed);
};
