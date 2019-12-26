import ReknownClient from '../structures/client';
import { GuildChannel, MessageEmbed } from 'discord.js';

async function sendLog (client: ReknownClient, channel: GuildChannel) {
  const embed = new MessageEmbed()
    .addField('Channel', client.escMD(channel.name))
    .addField('Channel Type', channel.type)
    .setColor(client.config.embedColor)
    .setFooter(`ID: ${channel.id}`)
    .setTimestamp()
    .setTitle('Channel Deleted');

  if (channel.parent) embed.addField('Category', client.escMD(channel.parent.name));

  client.functions.sendLog(client, embed, channel.guild);
}

export async function run (client: ReknownClient, channel: GuildChannel) {
  if (!channel.guild.available) return;

  sendLog(client, channel);
}
