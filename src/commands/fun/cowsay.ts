import { HelpObj } from 'ReknownBot';
import { Message } from 'discord.js';
import ReknownClient from '../../structures/client';
import { say } from 'cowsay';

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
  usage: 'cowsay <Message>'
};
