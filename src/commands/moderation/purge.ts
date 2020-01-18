import type { HelpObj } from 'ReknownBot';
import type ReknownClient from '../../structures/client';
import type { Message, PermissionString, TextChannel } from 'discord.js';

export async function run (client: ReknownClient, message: Message & { channel: TextChannel }, args: string[]) {
  if (!args[1]) return client.functions.noArg(message, 1, 'an amount to purge.');
  const amt = parseInt(args[1]);
  if (amt < 1 || amt > 100) return client.functions.badArg(message, 1, 'The amount must be from 1-100.');

  if (amt === 100) await message.delete();
  message.channel.bulkDelete(amt === 100 ? amt : amt + 1, true);
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
