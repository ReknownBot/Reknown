import type { GuildChannel } from 'discord.js';
import { MessageEmbed } from 'discord.js';
import type ReknownClient from '../structures/client';
import { ColorResolvable, DMChannel } from 'discord.js';

async function sendLog (client: ReknownClient, channel: GuildChannel) {
  const embed = new MessageEmbed()
    .addFields([
      {
        name: 'Channel',
        value: client.escMD(channel.name)
      },
      {
        name: 'Channel Type',
        value: channel.type
      }
    ])
    .setColor(client.config.embedColor as ColorResolvable)
    .setFooter(`ID: ${channel.id}`)
    .setTimestamp()
    .setTitle('Channel Deleted');

  if (channel.parent) embed.addField('Category', client.escMD(channel.parent.name));

  client.functions.sendLog(client, embed, channel.guild);
}

export async function run (client: ReknownClient, channel: DMChannel | GuildChannel) {
  if (channel.type === 'DM' || !channel.guild.available) return;

  sendLog(client, channel);
}
