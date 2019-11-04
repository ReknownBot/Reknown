import { HelpObj } from 'ReknownBot';
import { Message } from 'discord.js';
import ReknownClient from '../../structures/client';
import { think } from 'cowsay';

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
  usage: 'cowthink <Message>'
};
