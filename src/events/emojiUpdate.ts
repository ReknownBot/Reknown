import ReknownClient from '../structures/client';
import { GuildEmoji, MessageEmbed } from 'discord.js';

async function sendLog (client: ReknownClient, oldEmoji: GuildEmoji, newEmoji: GuildEmoji) {
  if (oldEmoji.name === newEmoji.name) return;

  const embed = new MessageEmbed()
    .addField('Old Emoji Name', client.escMD(oldEmoji.name))
    .addField('New Emoji Name', client.escMD(newEmoji.name))
    .addField('Animated', newEmoji.animated ? 'Yes' : 'No')
    .setColor(client.config.embedColor)
    .setFooter(`ID: ${newEmoji.id}`)
    .setThumbnail(newEmoji.url!)
    .setTimestamp()
    .setTitle('Emoji Name Updated');

  client.functions.sendLog(client, embed, newEmoji.guild);
}

export async function run (client: ReknownClient, oldEmoji: GuildEmoji, newEmoji: GuildEmoji) {
  if (!newEmoji.guild.available) return;

  sendLog(client, oldEmoji, newEmoji);
}
