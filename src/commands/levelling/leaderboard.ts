import { MessageEmbed } from 'discord.js';
import type ReknownClient from '../../structures/client';
import { tables } from '../../Constants';
import type { HelpObj, RowLevel } from 'ReknownBot';
import type { Message, PermissionString, TextChannel } from 'discord.js';

export async function run (client: ReknownClient, message: Message & { channel: TextChannel }, args: string[]) {
  const res = await client.query(`SELECT * FROM ${tables.LEVELS} WHERE guildid = $1 ORDER BY points DESC`, [ message.guild!.id ]);
  const rows: RowLevel[] = res.rows;
  if (rows.length === 0) return message.reply('There was no levelling data found for this server.');

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
    .setColor(client.config.embedColor)
    .setDescription(desc)
    .setFooter(`Requested by ${message.author!.tag}`, message.author!.displayAvatarURL())
    .setTimestamp()
    .setTitle(`Levelling Leaderboard for ${message.guild!.name}`);

  message.channel.send(embed);
}

export const help: HelpObj = {
  aliases: [ 'toplevel' ],
  category: 'Levelling',
  desc: 'Shows the levelling leaderboard for the current server.',
  togglable: true,
  usage: 'leaderboard'
};

export const memberPerms: PermissionString[] = [];

export const permissions: PermissionString[] = [
  'EMBED_LINKS'
];
