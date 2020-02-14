import { DMChannel } from 'discord.js';
import type { GuildChannel } from 'discord.js';
import { MessageEmbed } from 'discord.js';
import type ReknownClient from '../structures/client';

async function sendLog (client: ReknownClient, channel: GuildChannel) {
  const embed = new MessageEmbed()
    .addField('Channel', channel.toString())
    .addField('Channel Type', channel.type)
    .setColor(client.config.embedColor)
    .setFooter(`ID: ${channel.id}`)
    .setTimestamp()
    .setTitle('Channel Created');

  if (channel.parent) embed.addField('Category', client.escMD(channel.parent.name));

  client.functions.sendLog(client, embed, channel.guild);
}

export async function run (client: ReknownClient, channel: DMChannel | GuildChannel) {
  if (channel instanceof DMChannel || !channel.guild.available) return;

  sendLog(client, channel);
}
