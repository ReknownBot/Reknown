import type { GuildEmoji } from 'discord.js';
import { MessageEmbed } from 'discord.js';
import type ReknownClient from '../structures/client';

async function sendLog (client: ReknownClient, oldEmoji: GuildEmoji, newEmoji: GuildEmoji) {
  if (oldEmoji.name === newEmoji.name) return;

  const embed = new MessageEmbed()
    .addFields([
      {
        name: 'Old Emoji Name',
        value: client.escMD(oldEmoji.name)
      },
      {
        name: 'New Emoji Name',
        value: client.escMD(newEmoji.name)
      },
      {
        name: 'Animated',
        value: newEmoji.animated ? 'Yes' : 'No'
      }
    ])
    .setColor(client.config.embedColor)
    .setFooter(`ID: ${newEmoji.id}`)
    .setThumbnail(newEmoji.url)
    .setTimestamp()
    .setTitle('Emoji Name Updated');

  client.functions.sendLog(client, embed, newEmoji.guild);
}

export async function run (client: ReknownClient, oldEmoji: GuildEmoji, newEmoji: GuildEmoji) {
  if (!newEmoji.guild.available) return;

  sendLog(client, oldEmoji, newEmoji);
}
