import ReknownClient from '../structures/client';
import { GuildEmoji, MessageEmbed } from 'discord.js';

async function sendLog (client: ReknownClient, emoji: GuildEmoji) {
  const embed = new MessageEmbed()
    .addField('Emoji Name', client.escMD(emoji.name))
    .addField('Animated', emoji.animated ? 'Yes' : 'No')
    .setColor(client.config.embedColor)
    .setFooter(`ID: ${emoji.id}`)
    .setThumbnail(emoji.url)
    .setTimestamp()
    .setTitle('Emoji Created');

  client.functions.sendLog(client, embed, emoji.guild);
}

export async function run (client: ReknownClient, emoji: GuildEmoji) {
  if (!emoji.guild.available) return;

  sendLog(client, emoji);
}
