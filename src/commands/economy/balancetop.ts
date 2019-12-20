import ReknownClient from '../../structures/client';
import { tables } from '../../Constants';
import { EconomyRow, HelpObj } from 'ReknownBot';
import { Message, MessageEmbed, PermissionString } from 'discord.js';

export async function run (client: ReknownClient, message: Message, args: string[]) {
  const { rows }: { rows: EconomyRow[] } = await client.query(`SELECT * FROM ${tables.ECONOMY} ORDER BY balance DESC LIMIT 10`);
  const desc = await Promise.all(rows.map(async (r, i) => {
    const user = await client.users.fetch(r.userid).catch(() => null);
    if (!user) return client.query(`DELETE FROM ${tables.ECONOMY} WHERE userid = $1`, [ r.userid ]);
    let emoji = '🎀';
    if (i === 0) emoji = '🥇';
    else if (i === 1) emoji = '🥈';
    else if (i === 2) emoji = '🥉';
    return `${emoji} ${client.escMD(user.tag)} - **$${client.functions.formatNum(r.balance)}**`;
  }));

  const embed = new MessageEmbed()
    .setColor(client.config.embedColor)
    .setDescription(desc)
    .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL())
    .setTimestamp()
    .setTitle('Balance Leaderboard');

  message.channel.send(embed);
}

export const help: HelpObj = {
  aliases: [ 'baltop' ],
  category: 'Economy',
  desc: 'Shows the top 10 users with the most balance.',
  dm: true,
  togglable: true,
  usage: 'balancetop'
};

export const permissions: PermissionString[] = [
  'EMBED_LINKS'
];
