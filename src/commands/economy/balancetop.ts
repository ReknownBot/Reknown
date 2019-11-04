import ReknownClient from '../../structures/client';
import { tables } from '../../Constants';
import { Message, MessageEmbed, TextChannel } from 'discord.js';

export async function run (client: ReknownClient, message: Message, args: string[]) {
  if (message.channel instanceof TextChannel && !message.channel.permissionsFor(client.user!)!.has('EMBED_LINKS')) return client.functions.noClientPerms(message, [ 'Embed Links' ], message.channel);

  const { rows } = await client.query(`SELECT * FROM ${tables.ECONOMY} ORDER BY balance DESC LIMIT 10`);
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

export const help = {
  aliases: [ 'baltop' ],
  category: 'Economy',
  desc: 'Shows the top 10 users with the most balance.',
  dm: true,
  usage: 'balancetop'
};
