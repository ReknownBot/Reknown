import type { HelpObj } from 'ReknownBot';
import type ReknownClient from '../../structures/client';
import type { Message, PermissionString, TextChannel } from 'discord.js';

export async function run (client: ReknownClient, message: Message & { channel: TextChannel }, args: string[]) {
  if (!args[1]) return client.functions.noArg(message, 1, 'a role to mention.');
  const role = message.guild!.roles.find(r => r.name === args.slice(1).join(' ')) || message.guild!.roles.get(args[1]);
  if (!role) return client.functions.badArg(message, 1, 'I did not find the role. Please provide the name (case sensitive) or the ID of the role.');
  if (role.position >= message.guild!.me!.roles.highest.position) return client.functions.badArg(message, 1, 'That role\'s position is higher or equal to my highest role\'s position.');

  const mentionable = role.mentionable;
  if (!mentionable) {
    if ((!message.member!.hasPermission('MANAGE_ROLES') ||
    role.position >= message.member!.roles.highest.position) &&
    message.author.id !== message.guild!.ownerID) return message.channel.send('You do not have enough permissions to mention that role. You need the `Manage Roles` permission and also have to be above the mentioning role.');

    await role.setMentionable(true);
  }
  await message.channel.send(`**Mentioned by ${client.escMD(message.author.tag)}** - ${role}`);
  if (!mentionable) await role.setMentionable(false);
}

export const help: HelpObj = {
  aliases: [],
  category: 'Utility',
  desc: 'Mentions a provided role in the current channel.',
  togglable: true,
  usage: 'mention <Role>'
};

export const memberPerms: PermissionString[] = [];

export const permissions: PermissionString[] = [
  'MANAGE_ROLES'
];
