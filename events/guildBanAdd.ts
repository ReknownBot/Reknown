import ReknownClient from '../structures/client';
import { MessageEmbed, User, Guild } from 'discord.js';

async function sendLog (client: ReknownClient, guild: Guild, user: User) {
  const bans = await guild.fetchBans();
  const ban = bans.find(b => b.user.id === user.id)!;

  const embed = new MessageEmbed()
    .addField('User', user.tag)
    .setColor(client.config.embedColor)
    .setFooter(`ID: ${user.id}`)
    .setThumbnail(user.displayAvatarURL({ size: 512 }))
    .setTimestamp()
    .setTitle('Member Banned');
  if (ban.reason) embed.addField('Reason', ban.reason);

  client.functions.sendLog(client, embed, guild);
}

module.exports.run = async (client: ReknownClient, guild: Guild, user: User) => {
  if (!guild.available) return;
  if (user.id === client.user!.id) return;

  sendLog(client, guild, user);
};
