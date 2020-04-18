import type ColumnTypes from '../../typings/ColumnTypes';
import type { GuildMessage } from '../../Constants';
import type { HelpObj } from '../../structures/commandhandler';
import { MessageEmbed } from 'discord.js';
import type { PermissionString } from 'discord.js';
import type ReknownClient from '../../structures/client';
import { errors, tables } from '../../Constants';

export async function run (client: ReknownClient, message: GuildMessage, args: string[]) {
  const member = args[1] ?
    await client.functions.parseMention(args[1], {
      guild: message.guild,
      type: 'member'
    }).catch(() => null) :
    message.member;
  if (!member) return client.functions.badArg(message, 1, errors.UNKNOWN_MEMBER);

  const [ row ] = await client.sql<ColumnTypes['LEVEL']>`
    SELECT * FROM ${client.sql(tables.LEVELS)}
      WHERE guildid = ${message.guild.id}
        AND userid = ${member.id}
  `;
  const points = row ? row.points : 0;
  const level = row ? row.level : 0;
  const reqPoints = client.functions.formatNum(Math.pow((level + 1) / 0.2, 2));
  const rows = await client.sql<ColumnTypes['LEVEL']>`SELECT * FROM ${client.sql(tables.LEVELS)} WHERE guildid = ${message.guild.id} ORDER BY points DESC`;
  let rank: string;
  if (!row) rank = 'N/A';
  else rank = `#${rows.indexOf(row) + 1}`;

  const embed = new MessageEmbed()
    .addFields([
      {
        inline: true,
        name: 'XP',
        value: `${client.functions.formatNum(points)}/${reqPoints}`
      },
      {
        inline: true,
        name: 'Level',
        value: client.functions.formatNum(level)
      },
      {
        name: 'Rank',
        value: rank
      }
    ])
    .setColor(client.config.embedColor)
    .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL())
    .setTimestamp()
    .setTitle(`${message.member === member ? 'Your' : `${member.user.tag}'s`} Levelling Information`);

  message.channel.send(embed);
}

export const help: HelpObj = {
  aliases: [ 'rank' ],
  category: 'Levelling',
  desc: 'Shows levelling information of a user.',
  togglable: true,
  usage: 'level [Member]'
};

export const memberPerms: PermissionString[] = [];

export const permissions: PermissionString[] = [
  'EMBED_LINKS'
];
