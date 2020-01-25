import type { HelpObj } from 'ReknownBot';
import type ReknownClient from '../../structures/client';
import type { Message, PermissionString, TextChannel } from 'discord.js';

export async function run (client: ReknownClient, message: Message & { channel: TextChannel }, args: string[]) {
  if (!args[1]) return client.functions.noArg(message, 1, 'a user to ban.');
  const member = await client.functions.parseMention(args[1], { guild: message.guild!, type: 'member' }).catch(() => null);
  const reason = args[2] ? args.slice(2).join(' ') : undefined;
  if (member) {
    if (member.roles.highest.position >= message.member!.roles.highest.position && message.author.id !== message.guild!.ownerID) return client.functions.badArg(message, 1, 'Your role position is not high enough to ban that member.');
    if (!member.bannable) return client.functions.badArg(message, 1, 'I do not have enough powers to ban that member. Please check my permissions and my role position. Note that I cannot ban owners.');
    member.ban({ reason: reason });
    return message.channel.send(`Successfully banned member ${client.escMD(member.user.tag)} (ID: ${member.id})${reason ? ` for reason \`\`${client.escInline(reason)}\`\`` : ''}.`);
  }

  const user = await client.functions.parseMention(args[1], { type: 'user', client: client }).catch(() => null);
  if (!user) return client.functions.badArg(message, 1, `I did not find a user by that query (${client.escMD(args[0])}).`);
  message.guild!.members.ban(user, { reason: reason });
  message.channel.send(`Successfully banned user ${client.escMD(user.tag)} (ID: ${user.id})${reason ? ` for reason \`\`${client.escInline(reason)}\`\`` : ''}.`);
}

export const help: HelpObj = {
  aliases: [ 'banish' ],
  category: 'Moderation',
  desc: 'Bans a user.',
  togglable: true,
  usage: 'ban <User> [Reason]'
};

export const memberPerms: PermissionString[] = [
  'BAN_MEMBERS'
];

export const permissions: PermissionString[] = [
  'BAN_MEMBERS'
];
