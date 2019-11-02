import { LevelRow } from 'ReknownBot';
import ReknownClient from '../../structures/client';
import { tables } from '../../Constants';
import { Message, MessageEmbed, TextChannel } from 'discord.js';

export async function run (client: ReknownClient, message: Message & { channel: TextChannel }, args: string[]) {
  if (!message.channel.permissionsFor(client.user!)!.has('EMBED_LINKS')) return client.functions.noClientPerms(message, [ 'Embed Links' ], message.channel);

  const res = await client.query(`SELECT * FROM ${tables.LEVELS} WHERE guildid = $1 ORDER BY points DESC`, [ message.guild!.id ]);
  const rows: LevelRow[] = res.rows;
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

export const help = {
  aliases: [ 'toplevel' ],
  category: 'Levelling',
  desc: 'Shows the levelling leaderboard for the current server.',
  usage: 'leaderboard'
};
