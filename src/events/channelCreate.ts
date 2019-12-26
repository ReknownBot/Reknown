import ReknownClient from '../structures/client';
import { GuildChannel, MessageEmbed } from 'discord.js';

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

export async function run (client: ReknownClient, channel: GuildChannel) {
  if (!channel.guild.available) return;

  sendLog(client, channel);
}
