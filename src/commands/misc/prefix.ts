import type { GuildMessage } from '../../Constants';
import type { HelpObj } from '../../structures/CommandHandler';
import type ReknownClient from '../../structures/Client';
import { tables } from '../../Constants';
import { PermissionResolvable, Permissions } from 'discord.js';

export async function run (client: ReknownClient, message: GuildMessage, args: string[]) {
  if (!args[1]) {
    const prefix = await client.functions.getPrefix(client, message.guild.id);
    return message.reply(`The prefix for **${client.escMD(message.guild.name)}** is: \`\`${client.escInline(prefix)}\`\``);
  }

  if (!message.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) return client.functions.noPerms(message, [ Permissions.FLAGS.ADMINISTRATOR ]);
  const prefix = args.slice(1).join(' ');
  if (prefix.length > 15) return client.functions.badArg(message, 1, 'The prefix length must be lower than 16.');
  
  const columns = {
    customprefix: prefix,
    guildid: message.guild.id
  };
  client.sql`
    INSERT INTO ${client.sql(tables.PREFIX)} ${client.sql(columns)}
      ON CONFLICT (guildid) DO UPDATE
        SET ${client.sql(columns)}
  `;

  client.prefixes[message.guild.id] = prefix;

  message.reply(`Successfully updated the prefix to \`\`${client.escInline(prefix)}\`\`.`);
}

export const help: HelpObj = {
  aliases: [],
  category: 'Miscellaneous',
  desc: 'Displays the prefix of the server.',
  togglable: true,
  usage: 'prefix [New Prefix]'
};

export const memberPerms: PermissionResolvable[] = [];

export const permissions: PermissionResolvable[] = [];
