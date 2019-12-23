import { HelpObj } from 'ReknownBot';
import ReknownClient from '../../structures/client';
import { think } from 'cowsay';
import { Message, PermissionString } from 'discord.js';

export async function run (client: ReknownClient, message: Message, args: string[]) {
  if (!args[1]) return client.functions.noArg(message, 1, 'a message for a cow to think about.');
  const msg = args.slice(1).join(' ');

  message.channel.send(`\`\`\`${think({ text: msg })}\`\`\``);
}

export const help: HelpObj = {
  aliases: [],
  category: 'Fun',
  desc: 'Makes a cow think of something.',
  dm: true,
  togglable: true,
  usage: 'cowthink <Message>'
};

export const memberPerms: PermissionString[] = [];

export const permissions: PermissionString[] = [];
