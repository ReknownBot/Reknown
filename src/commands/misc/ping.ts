import type { HelpObj } from '../../structures/commandhandler';
import type ReknownClient from '../../structures/client';
import type { Message, PermissionResolvable } from 'discord.js';

export async function run (client: ReknownClient, message: Message, args: string[]) {
  const msg = await message.reply(`Pong! :heartbeat: \`${Math.round(client.ws.ping * 10) / 10}ms\``);
  msg.edit(`${msg.content} :stopwatch: \`${msg.createdTimestamp - message.createdTimestamp}ms\``);
}

export const help: HelpObj = {
  aliases: [ 'pong' ],
  category: 'Miscellaneous',
  desc: 'Displays the ping of the bot.',
  dm: true,
  togglable: false,
  usage: 'ping'
};

export const memberPerms: PermissionResolvable[] = [];

export const permissions: PermissionResolvable[] = [];
