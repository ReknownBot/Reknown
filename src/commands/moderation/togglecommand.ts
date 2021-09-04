import type ColumnTypes from '../../typings/ColumnTypes';
import type { GuildMessage } from '../../Constants';
import type { HelpObj } from '../../structures/commandhandler';
import type ReknownClient from '../../structures/client';
import { PermissionResolvable, Permissions } from 'discord.js';
import { errors, tables } from '../../Constants';

export async function run (client: ReknownClient, message: GuildMessage, args: string[]) {
  if (!args[1]) return client.functions.noArg(message, 1, 'A command to toggle.');
  const command = client.commands.aliases[args[1].toLowerCase()];
  if (!command) return client.functions.badArg(message, 1, errors.UNKNOWN_COMMNAD);
  const cmdInfo = client.commands.get(command)!;
  if (!cmdInfo.help.togglable) return client.functions.badArg(message, 1, 'You cannot toggle this command.');

  const [ row ] = await client.sql<ColumnTypes['DISABLEDCOMMANDS'][]>`
    SELECT * FROM ${client.sql(tables.DISABLEDCOMMANDS)}
      WHERE command = ${command}
        AND guildid = ${message.guild.id}
  `;
  let bool;
  if (!args[2]) bool = !row;
  else if (args[2].toLowerCase() === 'enable') bool = false;
  else if (args[2].toLowerCase() === 'disable') bool = true;
  else return client.functions.badArg(message, 2, 'This parameter must be "enable" or "disable".');

  if (Boolean(row) === bool) return client.functions.badArg(message, 2, 'The value is already set to that!');

  if (bool) {
    client.sql`INSERT INTO ${client.sql(tables.DISABLEDCOMMANDS)} ${client.sql({
      command: command,
      guildid: message.guild.id
    })}`;
  } else client.sql`DELETE FROM ${client.sql(tables.DISABLEDCOMMANDS)} WHERE command = ${command} AND guildid = ${message.guild.id}`;

  message.reply(`Successfully ${bool ? 'disabled' : 'enabled'} \`${command}\`.`);
}

export const help: HelpObj = {
  aliases: [ 'cmdtoggle', 'togglecmd' ],
  category: 'Moderation',
  desc: 'Toggles availability of a command for a server.',
  togglable: false,
  usage: 'togglecommand <Command> ["enable"/"disable"]'
};

export const memberPerms: PermissionResolvable[] = [
  Permissions.FLAGS.ADMINISTRATOR
];

export const permissions: PermissionResolvable[] = [];
