import type { HelpObj } from 'ReknownBot';
import type ReknownClient from '../../structures/client';
import { errors } from '../../Constants';
import type { Message, PermissionString, TextChannel } from 'discord.js';

export async function run (client: ReknownClient, message: Message & { channel: TextChannel }, args: string[]) {
  if (!args[1]) return client.functions.noArg(message, 1, 'a user to kick.');
  const member = await client.functions.parseMention(args[1], { guild: message.guild!, type: 'member' }).catch(() => null);
  const reason = args.slice(2).join(' ');
  if (!member) return client.functions.badArg(message, 1, errors.UNKNOWN_MEMBER);
  if (member.roles.highest.position >= message.member!.roles.highest.position && message.author.id !== message.guild!.ownerID) return client.functions.badArg(message, 1, errors.MEMBER_INSUFFICIENT_POSITION);
  if (!member.kickable) return client.functions.badArg(message, 1, 'I do not have enough powers to kick that member. Please check my permissions and my role position. Note that I cannot kick owners.');
  member.kick(reason);
  message.channel.send(`Successfully kicked member ${client.escMD(member.user.tag)} (ID: ${member.id})${reason ? ` for reason \`\`${client.escInline(reason)}\`\`` : ''}.`);
}

export const help: HelpObj = {
  aliases: [],
  category: 'Moderation',
  desc: 'Kicks a user.',
  togglable: true,
  usage: 'kick <User> [Reason]'
};

export const memberPerms: PermissionString[] = [
  'KICK_MEMBERS'
];

export const permissions: PermissionString[] = [
  'KICK_MEMBERS'
];
