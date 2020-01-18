import type ReknownClient from '../structures/client';
import { DMChannel, GuildChannel, MessageEmbed } from 'discord.js';

async function sendLog (client: ReknownClient, oldChannel: GuildChannel, newChannel: GuildChannel) {
  if (oldChannel.name === newChannel.name) return;

  const embed = new MessageEmbed()
    .addField('Old Channel Name', client.escMD(oldChannel.name))
    .addField('New Channel Name', client.escMD(newChannel.name))
    .addField('Channel Type', newChannel.type)
    .setColor(client.config.embedColor)
    .setFooter(`ID: ${newChannel.id}`)
    .setTimestamp()
    .setTitle('Channel Name Updated');

  client.functions.sendLog(client, embed, newChannel.guild);
}

export async function run (client: ReknownClient, oldChannel: DMChannel | GuildChannel, newChannel: DMChannel | GuildChannel) {
  if (oldChannel instanceof DMChannel || newChannel instanceof DMChannel) return;
  if (!newChannel.guild.available) return;

  sendLog(client, oldChannel, newChannel);
}
