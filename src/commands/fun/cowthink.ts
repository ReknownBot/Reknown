import type { HelpObj } from '../../structures/commandhandler';
import type ReknownClient from '../../structures/client';
import { think } from 'cowsay';
import type { Message, PermissionResolvable } from 'discord.js';

export async function run (client: ReknownClient, message: Message, args: string[]) {
  if (!args[1]) return client.functions.noArg(message, 1, 'a message for a cow to think about.');
  const msg = args.slice(1).join(' ');

  message.reply(`\`\`\`${think({ text: msg })}\`\`\``);
}

export const help: HelpObj = {
  aliases: [],
  category: 'Fun',
  desc: 'Makes a cow think of something.',
  dm: true,
  togglable: true,
  usage: 'cowthink <Message>'
};

export const memberPerms: PermissionResolvable[] = [];

export const permissions: PermissionResolvable[] = [];
