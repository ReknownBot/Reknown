import { HelpObj } from 'ReknownBot';
import ReknownClient from '../../structures/client';
import { say } from 'cowsay';
import { Message, PermissionString } from 'discord.js';

export async function run (client: ReknownClient, message: Message, args: string[]) {
  if (!args[1]) return client.functions.noArg(message, 1, 'a message for a cow to say.');
  const msg = args.slice(1).join(' ');

  message.channel.send(`\`\`\`${say({ text: msg })}\`\`\``);
}

export const help: HelpObj = {
  aliases: [],
  category: 'Fun',
  desc: 'Makes a cow say something.',
  dm: true,
  togglable: true,
  usage: 'cowsay <Message>'
};

export const memberPerms: PermissionString[] = [];

export const permissions: PermissionString[] = [];
