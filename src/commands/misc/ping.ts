import { HelpObj } from 'ReknownBot';
import ReknownClient from '../../structures/client';
import { Message, PermissionString } from 'discord.js';

export async function run (client: ReknownClient, message: Message, args: string[]) {
  const msg = await message.channel.send(`Pong! :heartbeat: \`${Math.round(client.ws.ping * 10) / 10}ms\``);
  msg.edit(`${msg.content} :stopwatch: \`${Date.now() - msg.createdTimestamp}ms\``);
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
