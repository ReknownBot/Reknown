import ReknownClient from '../structures/client';
import { Message } from 'discord.js';

module.exports.run = async (client: ReknownClient, message: Message): Promise<void> => {
  if (message.author.bot || !message.guild.available) return;
  if (message.member.partial) await message.member.fetch();

  const prefix = await client.functions.getPrefix(client, message.guild.id);
  if (!message.content.startsWith(prefix) || message.content === prefix) return;
  const args = message.content.slice(prefix.length).split(/ +/g);
  let cmd = args[0].toLowerCase();
  if (!Object.keys(client.aliases).includes(cmd)) return;
  cmd = client.aliases[cmd];

  client.commands.get(cmd).run(client, message, args);
};
