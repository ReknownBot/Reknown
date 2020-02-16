import type { HelpObj } from 'ReknownBot';
import type ReknownClient from '../../structures/client';
import type { Message, PermissionString } from 'discord.js';

export async function run (client: ReknownClient, message: Message, args: string[]) {
  const msg = await message.channel.send(`Pong! :heartbeat: \`${Math.round(client.ws.ping * 10) / 10}ms\``);
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

export const memberPerms: PermissionString[] = [];

export const permissions: PermissionString[] = [];
