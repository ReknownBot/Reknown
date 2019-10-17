import { ReknownClient } from 'ReknownBot';
import { Message } from 'discord.js';
import { think } from 'cowsay';

module.exports.run = (client: ReknownClient, message: Message, args: string[]) => {
  if (!args[1]) return client.functions.noArg(message, 1, 'a message for a cow to think about.');
  const msg = args.slice(1).join(' ');

  message.channel.send(`\`\`\`${think({ text: msg })}\`\`\``);
};

module.exports.help = {
  aliases: [],
  category: 'Fun',
  desc: 'Makes a cow think of something.',
  usage: 'cowthink <Message>'
};
