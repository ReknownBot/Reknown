import type { GuildEmoji } from 'discord.js';
import { MessageEmbed } from 'discord.js';
import type ReknownClient from '../structures/client';


async function sendLog (client: ReknownClient, emoji: GuildEmoji) {
  const embed = new MessageEmbed()
    .addField('Emoji Name', client.escMD(emoji.name))
    .addField('Animated', emoji.animated ? 'Yes' : 'No')
    .setColor(client.config.embedColor)
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
