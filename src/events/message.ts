import ReknownClient from '../structures/client';
import { DMChannel, Message } from 'discord.js';

const cooldowns = new Set();

export async function run (client: ReknownClient, message: Message) {
  if (message.author!.bot || message.guild && !message.guild.available) return;
  if (message.guild && message.member!.partial) await message.member!.fetch();
  if (message.guild && message.guild.me!.partial) await message.guild.me!.fetch();

  const prefix = message.guild ? await client.functions.getPrefix(client, message.guild.id) : client.config.prefix;
  const regexp = new RegExp(`^<@!?${message.client.user!.id}> `);
  if (!message.content.startsWith(prefix) && !message.content.match(regexp) || message.content === prefix) return;

  if (cooldowns.has(message.guild!.id)) return message.reply('This server is still on command cooldown! Please wait a second and try again.');

  let args: string[];
  if (message.content.match(regexp)) args = message.content.slice(message.content.match(regexp)![0].length).split(/ +/g);
  else args = message.content.slice(prefix.length).split(/ +/g);
  let cmd = args[0].toLowerCase();
  if (!Object.keys(client.aliases).includes(cmd)) return;

  cooldowns.add(message.guild!.id);
  setTimeout(() => cooldowns.delete(message.guild!.id), 1000);

  cmd = client.aliases[cmd];
  const cmdInfo = client.commands.get(cmd)!;
  if (message.channel instanceof DMChannel && !cmdInfo.help.dm) return message.reply('This command is only available in servers.');
  cmdInfo.run(client, message, args);
}
