import { MessageEmbed } from 'discord.js';
import type { PermissionString } from 'discord.js';
import type ReknownClient from '../../structures/client';
import ms from 'ms';
import type { GuildMessage, HelpObj, RowMuteRole, RowMutes } from 'ReknownBot';
import { errors, tables } from '../../Constants';

export async function run (client: ReknownClient, message: GuildMessage, args: string[]) {
  const row = await client.functions.getRow<RowMuteRole>(client, tables.MUTEROLE, {
    guildid: message.guild.id
  });
  let role = row ? message.guild.roles.cache.get(row.roleid) : message.guild.roles.cache.find(r => r.name === 'Muted');
  if (!role) {
    role = await message.guild.roles.create({
      data: {
        color: client.config.muteColor,
        name: 'Muted',
        permissions: message.guild.roles.everyone!.permissions.remove([ 'ADD_REACTIONS', 'SEND_MESSAGES', 'SPEAK' ])
      }
    });
    client.functions.updateRow<RowMuteRole>(client, tables.MUTEROLE, {
      guildid: message.guild.id,
      roleid: role.id
    }, {
      guildid: message.guild.id
    });
  }
  if (message.guild.me!.roles.highest.comparePositionTo(role) <= 0) return message.reply(`My highest role has to be higher than the \`\`${client.escInline(role.name)}\`\` role.`);

  if (!args[1]) return client.functions.noArg(message, 1, 'a member to mute.');
  const member = await client.functions.parseMention(args[1], {
    guild: message.guild,
    type: 'member'
  }).catch(() => null);
  if (!member) return client.functions.badArg(message, 1, errors.UNKNOWN_MEMBER);
  if (!member.manageable) return client.functions.badArg(message, 1, 'I do not have enough powers to mute that member. Please check my role position and note that owners cannot be muted.');

  const muteRow = await client.functions.getRow<RowMutes>(client, tables.MUTES, {
    guildid: message.guild.id,
    userid: member.id
  });
  if (muteRow) {
    if (member.roles.cache.has(role.id)) return client.functions.badArg(message, 1, errors.ALREADY_MUTED);
    await client.query(`DELETE FROM ${tables.MUTES} WHERE guildid = $1 AND userid = $2`, [ message.guild.id, member.id ]);
  }

  const duration = args[2] ? ms(args[2]) : 0;
  if (!duration) return client.functions.badArg(message, 2, 'The duration provided was invalid.');
  if (duration !== 0 && duration < ms('1m')) return client.functions.badArg(message, 2, 'The duration cannot be shorter than 1 minute.');
  if (duration > ms('30d')) return client.functions.badArg(message, 2, 'The duration cannot be longer than 30 days.');

  const reason = args[3] ? args.slice(3).join(' ') : undefined;
  if (reason?.includes('\n')) return client.functions.badArg(message, 2, errors.NO_LINE_BREAKS);

  client.query(`INSERT INTO ${tables.MUTES} (endsat, guildid, userid) VALUES ($1, $2, $3)`, [ Date.now() + duration, message.guild.id, member.id ]);
  member.roles.add(role);
  if (duration !== 0 && duration < ms('20d')) client.mutes.set(member.id, setTimeout(client.functions.unmute.bind(client.functions), duration, client, member));

  message.channel.send(`Successfully muted \`\`${client.escInline(member.user.tag)}\`\` for \`${duration === -1 ? 'Unlimited' : client.functions.getFullTime(duration)}\`.`);

  const embed = new MessageEmbed()
    .addField('Duration', client.functions.getFullTime(duration))
    .addField('Reason', reason || 'None')
    .addField('Muted by', `${message.member} [${client.escMD(message.author.tag)}] (ID: ${message.author.id})`)
    .setColor(client.config.embedColor)
    .setFooter(`ID: ${member.id}`)
    .setThumbnail(member.user.displayAvatarURL({ size: 512 }))
    .setTimestamp()
    .setTitle('Member Muted');

  client.functions.sendLog(client, embed, message.guild);
}

export const help: HelpObj = {
  aliases: [ 'silence' ],
  category: 'Moderation',
  desc: 'Mutes a member. Provide `0` as the duration for infinite time.',
  togglable: true,
  usage: 'mute <Member> [Duration=0] [Reason]'
};

export const memberPerms: PermissionString[] = [
  'KICK_MEMBERS',
  'MANAGE_ROLES'
];

export const permissions: PermissionString[] = [
  'MANAGE_ROLES'
];
