import type ReknownClient from '../structures/Client';
import { ColorResolvable, MessageEmbed } from 'discord.js';
import type { Message, PartialMessage } from 'discord.js';

function sendLog (client: ReknownClient, oldMessage: Message, newMessage: Message) {
  if (newMessage.author.bot) return;
  if (!oldMessage.content || !newMessage.content) return;
  if (oldMessage.content === newMessage.content) return;

  const embed = new MessageEmbed()
    .addFields([
      {
        inline: true,
        name: 'Author',
        value: `${newMessage.author} [${client.escMD(newMessage.author.tag)}] (ID: ${newMessage.author.id})`
      },
      {
        inline: true,
        name: 'Direct Link',
        value: `[Click](${newMessage.url})`
      },
      {
        name: 'Old Content',
        value: oldMessage.content.length > 1024 ? `${oldMessage.content.slice(0, 1021)}...` : oldMessage.content
      },
      {
        name: 'New Content',
        value: newMessage.content.length > 1024 ? `${newMessage.content.slice(0, 1021)}...` : newMessage.content
      }
    ])
    .setColor(client.config.embedColor as ColorResolvable)
    .setFooter(`ID: ${newMessage.id}`)
    .setTimestamp()
    .setTitle('Message Edited');

  client.functions.sendLog(client, embed, newMessage.guild!);
}

export async function run (client: ReknownClient, oldMessage: Message | PartialMessage, newMessage: Message | PartialMessage) {
  if (oldMessage.partial || newMessage.partial) return;
  if (!newMessage.guild?.available) return;

  sendLog(client, oldMessage, newMessage);
}
