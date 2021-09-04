import type ColumnTypes from '../../typings/ColumnTypes';
import type { GuildMessage } from '../../Constants';
import type { HelpObj } from '../../structures/commandhandler';
import type ReknownClient from '../../structures/client';
import { PermissionResolvable, Permissions } from 'discord.js';
import { errors, tables } from '../../Constants';

export async function run (client: ReknownClient, message: GuildMessage, args: string[]) {
  if (!args[1]) return client.functions.noArg(message, 1, 'a member to unwarn.');
  const member = await client.functions.parseMention(args[1], {
    guild: message.guild,
    type: 'member'
  }).catch(() => null);
  if (!member) return client.functions.badArg(message, 1, errors.UNKNOWN_MEMBER);
  if (member.user.bot) return client.functions.badArg(message, 1, 'You cannot unwarn a bot.');
  if (member.id === message.author.id && message.author.id !== message.guild.ownerId) return client.functions.badArg(message, 1, 'You cannot unwarn yourself.');
  if (member.id === message.guild.ownerId) return client.functions.badArg(message, 1, 'The member provided is the owner.');
  if (member.roles.highest.position >= message.member.roles.highest.position && message.author.id !== message.guild.ownerId) return client.functions.badArg(message, 1, errors.MEMBER_INSUFFICIENT_POSITION);

  if (!args[2]) return client.functions.noArg(message, 2, 'A warning number to remove.');
  const num = parseInt(args[2]);
  if (isNaN(num)) return client.functions.badArg(message, 2, 'The warning number provided was not a number.');
  if (num < 1) return client.functions.badArg(message, 2, 'The warning number cannot be lower than 1.');

  const rows = await client.sql<ColumnTypes['WARNINGS'][]>`SELECT * FROM ${client.sql(tables.WARNINGS)} WHERE guildid = ${message.guild.id} AND userid = ${member.id} ORDER BY warnedat ASC`;
  if (rows.count === 0) return client.functions.badArg(message, 1, 'That member does not have any warnings.');
  if (rows.count < num) return client.functions.badArg(message, 2, 'The warning number provided is out of range.');

  const row = rows[num - 1];
  client.sql`DELETE FROM ${client.sql(tables.WARNINGS)} WHERE guildid = ${message.guild.id} AND userid = ${member.id} AND warnedat = ${row.warnedat}`;

  message.reply(`Successfully removed warning #${num} (Reason: \`\`${client.escInline(row.warnreason || 'None')}\`\`) from ${client.escMD(member.user.tag)}.`);
}

export const help: HelpObj = {
  aliases: [ 'deletewarn', 'delwarn', 'removewarn' ],
  category: 'Moderation',
  desc: 'Removes a warning from a member.',
  togglable: true,
  usage: 'unwarn <Member> <Warning #>'
};

export const memberPerms: PermissionResolvable[] = [
  Permissions.FLAGS.KICK_MEMBERS
];

export const permissions: PermissionResolvable[] = [];
