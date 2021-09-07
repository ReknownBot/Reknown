import { MessageEmbed } from 'discord.js';
import type ReknownClient from '../structures/Client';
import type { ColorResolvable, GuildEmoji } from 'discord.js';

async function sendLog (client: ReknownClient, emoji: GuildEmoji) {
  if (emoji.name === null) return;
  const embed = new MessageEmbed()
    .addFields([
      {
        name: 'Emoji Name',
        value: client.escMD(emoji.name)
      },
      {
        name: 'Animated',
        value: emoji.animated ? 'Yes' : 'No'
      }
    ])
    .setColor(client.config.embedColor as ColorResolvable)
    .setFooter(`ID: ${emoji.id}`)
    .setThumbnail(emoji.url)
    .setTimestamp()
    .setTitle('Emoji Deleted');

  client.functions.sendLog(client, embed, emoji.guild);
}

export async function run (client: ReknownClient, emoji: GuildEmoji) {
  if (!emoji.guild.available) return;

  sendLog(client, emoji);
}
