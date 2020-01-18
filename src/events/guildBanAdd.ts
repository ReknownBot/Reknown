import { MessageEmbed } from 'discord.js';
import type ReknownClient from '../structures/client';
import type { Guild, User } from 'discord.js';

async function sendLog (client: ReknownClient, guild: Guild, user: User) {
  const embed = new MessageEmbed()
    .addField('User', user.tag)
    .setColor(client.config.embedColor)
    .setFooter(`ID: ${user.id}`)
    .setThumbnail(user.displayAvatarURL({ size: 512 }))
    .setTimestamp()
    .setTitle('Member Banned');

  if (guild.me!.hasPermission('BAN_MEMBERS')) {
    const bans = await guild.fetchBans();
    const ban = bans.find(b => b.user.id === user.id)!;
    if (ban.reason) embed.addField('Reason', ban.reason);
  }

  client.functions.sendLog(client, embed, guild);
}

export async function run (client: ReknownClient, guild: Guild, user: User) {
  if (!guild.available) return;
  if (user.id === client.user!.id) return;

  sendLog(client, guild, user);
}
