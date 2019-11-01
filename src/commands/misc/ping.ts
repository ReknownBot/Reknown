import { Message } from 'discord.js';
import ReknownClient from '../../structures/client';

export async function run (client: ReknownClient, message: Message, args: string[]) {
  const msg = await message.channel.send(`Pong! :heartbeat: \`${Math.round(client.ws.ping * 10) / 10}ms\``);
  msg.edit(`${msg.content} :stopwatch: \`${Date.now() - msg.createdTimestamp}ms\``);
}

export const help = {
  aliases: [ 'pong' ],
  category: 'Miscellaneous',
  desc: 'Displays the ping of the bot.',
  dm: true,
  usage: 'ping'
};
