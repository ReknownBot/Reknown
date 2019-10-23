import { Message } from 'discord.js';
import ReknownClient from '../../structures/client';

module.exports.run = async (client: ReknownClient, message: Message) => {
  const msg = await message.channel.send(`Pong! :heartbeat: \`${Math.round(client.ws.ping * 10) / 10}ms\``);
  msg.edit(`${msg.content} :stopwatch: \`${Date.now() - msg.createdTimestamp}ms\``);
};

module.exports.help = {
  aliases: [ 'pong' ],
  category: 'Miscellaneous',
  desc: 'Displays the ping of the bot.',
  usage: 'ping'
};
