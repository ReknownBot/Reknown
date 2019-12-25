import ReknownClient from '../../structures/client';
import { tables } from '../../Constants';
import { HelpObj, RowDisabledCommands } from 'ReknownBot';
import { Message, PermissionString, TextChannel } from 'discord.js';

export async function run (client: ReknownClient, message: Message & { channel: TextChannel }, args: string[]) {
  if (!args[1]) return client.functions.noArg(message, 1, 'A command to toggle.');
  const command = client.commands.aliases[args[1].toLowerCase()];
  if (!command) return client.functions.badArg(message, 1, 'I did not find that command.');
  const cmdInfo = client.commands.get(command)!;
  if (!cmdInfo.help.togglable) return client.functions.badArg(message, 1, 'You cannot toggle this command.');

  const row = await client.functions.getRow<RowDisabledCommands>(client, tables.DISABLEDCOMMANDS, {
    command: command,
    guildid: message.guild!.id
  });
  let bool;
  if (!args[2]) bool = !row;
  else if (args[2].toLowerCase() === 'enable') bool = false;
  else if (args[2].toLowerCase() === 'disable') bool = true;
  else return client.functions.badArg(message, 2, 'This parameter must be "enable" or "disable".');

  if (Boolean(row) === bool) return client.functions.badArg(message, 2, 'The value is already set to that!');

  if (bool) client.query(`INSERT INTO ${tables.DISABLEDCOMMANDS} (command, guildid) VALUES ($1, $2)`, [ command, message.guild!.id ]);
  else client.query(`DELETE FROM ${tables.DISABLEDCOMMANDS} WHERE command = $1 AND guildid = $2`, [ command, message.guild!.id ]);

  message.channel.send(`Successfully ${bool ? 'disabled' : 'enabled'} \`${command}\`.`);
}

export const help: HelpObj = {
  aliases: [ 'cmdtoggle', 'togglecmd' ],
  category: 'Moderation',
  desc: 'Toggles availability of a command for a server.',
  togglable: false,
  usage: 'togglecommand <Command> ["enable"/"disable"]'
};

export const memberPerms: PermissionString[] = [
  'ADMINISTRATOR'
];

export const permissions: PermissionString[] = [];
