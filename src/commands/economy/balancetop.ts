import type ColumnTypes from '../../typings/ColumnTypes';
import type { HelpObj } from '../../structures/CommandHandler';
import type { Message } from 'discord.js';
import type ReknownClient from '../../structures/Client';
import { tables } from '../../Constants';
import { ColorResolvable, MessageEmbed, PermissionResolvable, Permissions } from 'discord.js';

export async function run (client: ReknownClient, message: Message, args: string[]) {
  const rows = await client.sql<ColumnTypes['ECONOMY'][]>`SELECT * FROM ${client.sql(tables.ECONOMY)} ORDER BY balance DESC LIMIT 10`;
  const desc = await Promise.all(rows.map(async (r, i) => {
    const user = await client.users.fetch(r.userid).catch(() => null);
    if (!user) return client.sql`DELETE FROM ${client.sql(tables.ECONOMY)} WHERE userid = ${r.userid}`;
    let emoji = '🎀';
    if (i === 0) emoji = '🥇';
    else if (i === 1) emoji = '🥈';
    else if (i === 2) emoji = '🥉';
    return `${emoji} ${client.escMD(user.tag)} - **$${client.functions.formatNum(r.balance)}**`;
  }));

  const embed = new MessageEmbed()
    .setColor(client.config.embedColor as ColorResolvable)
    .setDescription(desc.join('\n'))
    .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL())
    .setTimestamp()
    .setTitle('Balance Leaderboard');

  message.reply({ embeds: [ embed ]});
}

export const help: HelpObj = {
  aliases: [ 'baltop' ],
  category: 'Economy',
  desc: 'Shows the top 10 users with the most balance.',
  dm: true,
  togglable: true,
  usage: 'balancetop'
};

export const memberPerms: PermissionResolvable[] = [];

export const permissions: PermissionResolvable[] = [
  Permissions.FLAGS.EMBED_LINKS
];
