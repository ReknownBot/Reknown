import type { GuildMessage } from '../../Constants';
import type { HelpObj } from '../../structures/CommandHandler';
import type ReknownClient from '../../structures/Client';
import { PermissionResolvable, Permissions } from 'discord.js';

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

export const memberPerms: PermissionResolvable[] = [
  Permissions.FLAGS.MANAGE_MESSAGES
];

export const permissions: PermissionResolvable[] = [
  Permissions.FLAGS.MANAGE_MESSAGES,
  Permissions.FLAGS.READ_MESSAGE_HISTORY
];
