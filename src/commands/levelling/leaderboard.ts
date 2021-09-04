import type ColumnTypes from '../../typings/ColumnTypes';
import type { GuildMessage } from '../../Constants';
import type { HelpObj } from '../../structures/commandhandler';
import type ReknownClient from '../../structures/client';
import { tables } from '../../Constants';
import { ColorResolvable, MessageEmbed, PermissionResolvable, Permissions } from 'discord.js';

export async function run (client: ReknownClient, message: GuildMessage, args: string[]) {
  const rows = await client.sql<ColumnTypes['LEVEL'][]>`SELECT * FROM ${client.sql(tables.LEVELS)} WHERE guildid = ${message.guild.id} ORDER BY points DESC`;
  if (rows.count === 0) return message.reply('There was no levelling data found for this server.');

  const users = rows.map(async (r, i) => {
    const user = await client.users.fetch(r.userid);
    let place: string;
    if (i === 0) place = ':first_place:';
    else if (i === 1) place = ':second_place:';
    else if (i === 2) place = ':third_place:';
    else place = ':ribbon:';
    return `${place} ${client.escMD(user.tag)} | Level: **${r.level}** | XP: **${r.points}**`;
  });
  const desc = (await Promise.all(users)).join('\n');

  const embed = new MessageEmbed()
    .setColor(client.config.embedColor as ColorResolvable)
    .setDescription(desc)
    .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL())
    .setTimestamp()
    .setTitle(`Levelling Leaderboard for ${message.guild.name}`);

  message.reply({ embeds: [ embed ] });
}

export const help: HelpObj = {
  aliases: [ 'toplevel' ],
  category: 'Levelling',
  desc: 'Shows the levelling leaderboard for the current server.',
  togglable: true,
  usage: 'leaderboard'
};

export const memberPerms: PermissionResolvable[] = [];

export const permissions: PermissionResolvable[] = [
  Permissions.FLAGS.EMBED_LINKS
];
