import type ColumnTypes from '../../typings/ColumnTypes';
import type { GuildMessage } from '../../Constants';
import type { HelpObj } from '../../structures/CommandHandler';
import type ReknownClient from '../../structures/Client';
import { ColorResolvable, MessageEmbed, PermissionResolvable, Permissions } from 'discord.js';
import { errors, tables } from '../../Constants';

export async function run (client: ReknownClient, message: GuildMessage, args: string[]) {
  const [ row ] = await client.sql<ColumnTypes['MUTEROLE'][]>`
    SELECT * FROM ${client.sql(tables.MUTEROLE)}
      WHERE guildid = ${message.guild.id}
  `;
  const role = row ? message.guild.roles.cache.get(row.roleid) : message.guild.roles.cache.find(r => r.name === 'Muted');
  if (!role) return message.reply('I did not find the mute role.');
  if (message.guild.me!.roles.highest.comparePositionTo(role) <= 0) return message.reply(`My highest role has to be higher than the \`\`${client.escInline(role.name)}\`\` role.`);

  if (!args[1]) return client.functions.noArg(message, 1, 'a member to unmute.');
  const member = await client.functions.parseMention(args[1], {
    guild: message.guild,
    type: 'member'
  }).catch(() => null);
  if (!member) return client.functions.badArg(message, 1, errors.UNKNOWN_MEMBER);

  const [ muteRow ] = await client.sql<ColumnTypes['MUTES'][]>`
    SELECT * FROM ${client.sql(tables.MUTES)}
      WHERE guildid = ${message.guild.id}
        AND userid = ${member.id}
  `;
  if (!muteRow) return client.functions.badArg(message, 1, 'The member provided is not muted.');

  const reason = args[2] ? args.slice(2).join(' ') : undefined;
  if (reason?.includes('\n')) return client.functions.badArg(message, 2, errors.NO_LINE_BREAKS);

  client.functions.unmute(client, member);
  message.reply(`Successfully unmuted \`\`${client.escInline(member.user.tag)}\`\`.`);

  const embed = new MessageEmbed()
    .addFields([
      {
        name: 'Member',
        value: `${member} [${client.escMD(member.user.tag)}] (ID: ${member.id})`
      },
      {
        name: 'Reason',
        value: reason || 'None'
      },
      {
        name: 'Unmuted by',
        value: `${message.member} [${client.escMD(message.author.tag)}] (ID: ${message.author.id})`
      }
    ])
    .setColor(client.config.embedColor as ColorResolvable)
    .setFooter(`ID: ${member.id}`)
    .setThumbnail(member.user.displayAvatarURL({ size: 512 }))
    .setTimestamp()
    .setTitle('Member Unmuted');

  client.functions.sendLog(client, embed, message.guild);
}

export const help: HelpObj = {
  aliases: [ 'unsilence' ],
  category: 'Moderation',
  desc: 'Unmutes a member.',
  togglable: true,
  usage: 'unmute <Member> [Reason]'
};

export const memberPerms: PermissionResolvable[] = [
  Permissions.FLAGS.KICK_MEMBERS,
  Permissions.FLAGS.MANAGE_ROLES
];

export const permissions: PermissionResolvable[] = [
  Permissions.FLAGS.MANAGE_ROLES
];
