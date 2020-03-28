import type { HelpObj } from '../../structures/commandhandler';
import type ReknownClient from '../../structures/client';
import type { Message, PermissionString } from 'discord.js';

export async function run (client: ReknownClient, message: Message, args: string[]) {
  if (!args[1]) return client.functions.noArg(message, 1, 'either "f" or "c" to convert to.');
  if (![ 'f', 'c' ].includes(args[1].toLowerCase())) return client.functions.badArg(message, 1, 'The value must be either "f" or "c".');
  const convertTo = args[1].toLowerCase();

  if (!args[2]) return client.functions.noArg(message, 2, 'A value to convert with.');
  const val = parseInt(args[2]);
  if (isNaN(val)) return client.functions.badArg(message, 2, 'The value must be a number.');

  const newVal = convertTo === 'f' ? val * (9 / 5) + 32 : (val - 32) * (5 / 9);

  message.channel.send(`The result is **${newVal}** degrees ${convertTo === 'f' ? 'fahrenheit' : 'celsius'}.`);
}

export const help: HelpObj = {
  aliases: [ 'temp' ],
  category: 'Utility',
  desc: 'Converts temperature from fahrenheit to celsius and vice-versa.',
  dm: true,
  togglable: true,
  usage: 'temperature <"f"/"c"> <Input>'
};

export const memberPerms: PermissionString[] = [];

export const permissions: PermissionString[] = [];
