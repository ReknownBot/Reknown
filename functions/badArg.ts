import { Message, TextChannel, MessageEmbed } from 'discord.js';
import { embedColor } from '../config.json';

module.exports = (message: Message, argNum: number, desc: string): void => {
  if (message.channel instanceof TextChannel && !message.channel.permissionsFor(message.guild.me).has('EMBED_LINKS')) return void message.channel.send(`:x: Argument **#${argNum}** was invalid. Here's what was wrong with it.\n\n**${desc}**`);

  const embed = new MessageEmbed()
    .setColor(embedColor)
    .setDescription(`Argument #${argNum} is invalid. Here's what was wrong with it.\n\n**${desc}**`)
    .setFooter(`Executed by ${message.author.tag}`, message.author.displayAvatarURL())
    .setTimestamp()
    .setTitle(`Argument #${argNum} Incorrect`);

  message.channel.send(embed);
};
