import ReknownClient from '../../structures/client';
import { Message, DMChannel } from 'discord.js';
import { PrefixRow } from 'ReknownBot';

module.exports.run = async (client: ReknownClient, message: Message, args: string[]): Promise<void> => {
  if (message.channel instanceof DMChannel) return void message.reply(':x: This command is only available in servers.');
  if (!args[1]) {
    const prefix = await client.functions.getPrefix(client, message.guild.id);
    message.channel.send(`The prefix for **${client.escMD(message.guild.name)}** is: \`${client.escMD(prefix)}\``);
    return;
  }

  if (!message.member.hasPermission('ADMINISTRATOR')) return client.functions.noPerms(message, [ 'Administrator' ]);
  const prefix = args.slice(1).join(' ');
  if (prefix.length > 15) return client.functions.badArg(message, 1, 'The prefix length must be lower than 16.');
  const row: PrefixRow = (await client.query('SELECT * FROM prefix WHERE guildid = $1', [ message.guild.id ])).rows[0];
  if (!row) client.query('INSERT INTO prefix (customprefix, guildid) VALUES ($1, $2)', [ prefix, message.guild.id ]);
  else client.query('UPDATE prefix SET customprefix = $1 WHERE guildid = $2', [ prefix, message.guild.id ]);

  message.channel.send(`Successfully updated the prefix to \`${client.escMD(prefix)}\`.`);
};

module.exports.help = {
  aliases: [],
  category: 'Miscellaneous',
  desc: 'Displays the prefix of the server.',
  usage: 'prefix [New Prefix]'
};
