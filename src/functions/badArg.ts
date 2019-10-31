import { embedColor } from '../config.json';
import { Message, MessageEmbed, TextChannel } from 'discord.js';

export function run (message: Message, argNum: number, desc: string) {
  if (message.channel instanceof TextChannel && !message.channel.permissionsFor(message.guild!.me!)!.has('EMBED_LINKS')) return message.channel.send(`Argument **#${argNum}** was invalid. Here's what was wrong with it.\n\n**${desc}**`);

  const embed = new MessageEmbed()
    .setColor(embedColor)
    .setDescription(`Argument #${argNum} is invalid. Here's what was wrong with it.\n\n**${desc}**`)
    .setFooter(`Executed by ${message.author.tag}`, message.author.displayAvatarURL())
    .setTimestamp()
    .setTitle(`Argument #${argNum} Incorrect`);

  message.channel.send(embed);
}
