import ReknownClient from '../../structures/client';
import { Message, DMChannel } from 'discord.js';

module.exports.run = async (client: ReknownClient, message: Message, args: string[]): Promise<void> => {
  if (message.channel instanceof DMChannel) return void message.reply(':x: This command is only available in servers.');
  if (!args[1]) {
    const prefix = await client.functions.getPrefix(client, message.guild.id);
    message.channel.send(`The prefix for **${client.escMD(message.guild.name)}** is: \`${client.escMD(prefix)}\``);
    return;
  }
};

module.exports.help = {
  aliases: [],
  category: 'Miscellaneous',
  desc: 'Displays the prefix of the server.',
  usage: 'prefix [New Prefix]'
};
