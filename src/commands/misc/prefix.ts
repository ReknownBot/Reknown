import ReknownClient from '../../structures/client';
import { Message, TextChannel } from 'discord.js';
import { tables } from '../../Constants';

export async function run (client: ReknownClient, message: Message & { channel: TextChannel }, args: string[]) {
  if (!args[1]) {
    const prefix = await client.functions.getPrefix(client, message.guild!.id);
    return message.channel.send(`The prefix for **${client.escMD(message.guild!.name)}** is: \`\`${client.escInline(prefix)}\`\``);
  }

  if (!message.member!.hasPermission('ADMINISTRATOR')) return client.functions.noPerms(message, [ 'Administrator' ]);
  const prefix = args.slice(1).join(' ');
  if (prefix.length > 15) return client.functions.badArg(message, 1, 'The prefix length must be lower than 16.');
  client.functions.updateRow(client, tables.PREFIX, {
    customprefix: prefix,
    guildid: message.guild!.id
  }, {
    guildid: message.guild!.id
  });

  message.channel.send(`Successfully updated the prefix to \`\`${client.escInline(prefix)}\`\`.`);
}

export const help = {
  aliases: [],
  category: 'Miscellaneous',
  desc: 'Displays the prefix of the server.',
  usage: 'prefix [New Prefix]'
};
