import type { PermissionString } from 'discord.js';
import type ReknownClient from '../../structures/client';
import type { GuildMessage, HelpObj } from 'ReknownBot';

export async function run (client: ReknownClient, message: GuildMessage, args: string[]) {
  if (!args[1]) return client.functions.noArg(message, 1, 'an amount to purge.');
  const amt = parseInt(args[1]);
  if (amt < 1 || amt > 100) return client.functions.badArg(message, 1, 'The amount must be from 1-100.');

  if (amt === 100) await message.delete();
  // Channel got deleted or bot does not have access to it
  message.channel.bulkDelete(amt === 100 ? amt : amt + 1, true).catch(() => null);
}

export const help: HelpObj = {
  aliases: [ 'clear' ],
  category: 'Moderation',
  desc: 'Clears x amount of messages.',
  togglable: true,
  usage: 'purge <Amount>'
};

export const memberPerms: PermissionString[] = [
  'MANAGE_MESSAGES'
];

export const permissions: PermissionString[] = [
  'MANAGE_MESSAGES',
  'READ_MESSAGE_HISTORY'
];
