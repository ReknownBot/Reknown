import ReknownClient from '../structures/client';
import { Message } from 'discord.js';

module.exports.run = async (client: ReknownClient, message: Message): Promise<void> => {
  if (message.author.bot || !message.guild || !message.guild.available) return;

  const prefix = await client.functions.getPrefix(client, message.guild.id) as unknown as string;
  if (!message.content.startsWith(prefix) || message.content === prefix) return;
  const args = message.content.slice(prefix.length).split(/ +/g);
  let cmd = args[0].toLowerCase();
  if (!Object.keys(client.aliases).includes(cmd)) return;
  cmd = client.aliases[cmd];

  return client.commands.get(cmd).run(client, message, args);
};
