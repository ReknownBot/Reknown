import type ReknownClient from '../structures/Client';
import type { ColorResolvable, GuildChannel } from 'discord.js';
import { DMChannel, MessageEmbed } from 'discord.js';

async function sendLog (client: ReknownClient, oldChannel: GuildChannel, newChannel: GuildChannel) {
  if (oldChannel.name === newChannel.name) return;

  const embed = new MessageEmbed()
    .addFields([
      {
        name: 'Old Channel Name',
        value: client.escMD(oldChannel.name)
      },
      {
        name: 'New Channel Name',
        value: client.escMD(newChannel.name)
      },
      {
        name: 'Channel Type',
        value: newChannel.type
      }
    ])
    .setColor(client.config.embedColor as ColorResolvable)
    .setFooter(`ID: ${newChannel.id}`)
    .setTimestamp()
    .setTitle('Channel Name Updated');

  client.functions.sendLog(client, embed, newChannel.guild);
}

export async function run (client: ReknownClient, oldChannel: DMChannel | GuildChannel, newChannel: DMChannel | GuildChannel) {
  if (oldChannel.type === 'DM' || newChannel.type === 'DM') return;
  if (!newChannel.guild.available) return;

  sendLog(client, oldChannel, newChannel);
}
