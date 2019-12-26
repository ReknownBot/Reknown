import { Message } from 'discord.js';
import { evaluate } from 'mathjs';
import { HelpObj, ReknownClient } from 'ReknownBot';

export async function run (client: ReknownClient, message: Message, args: string[]) {
  if (!args[1]) return client.functions.noArg(message, 1, 'an expression to evaluate.');
  const expression = args.slice(1).join(' ');

  try {
    let out = evaluate(expression);
    if (out.entries) out = out.entries.join('\n');
    else out = out.toString();

    message.channel.send(`**SUCCESS**\n\`\`\`${out}\`\`\``);
  } catch (e) {
    message.reply(`Your expression could be not parsed.\n\n\`\`\`xl\n${e.message}\n\`\`\``);
  }
}

export const help: HelpObj = {
  aliases: [ 'algorithm', 'calc', 'math' ],
  category: 'Utility',
  desc: 'Calculates an expression.',
  dm: true,
  togglable: true,
  usage: 'calculate <Expression>'
};
