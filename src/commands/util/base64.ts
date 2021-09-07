import type { HelpObj } from '../../structures/CommandHandler';
import type { Message } from 'discord.js';
import type ReknownClient from '../../structures/Client';
import atob from 'atob';
import btoa from 'btoa';
import { ColorResolvable, MessageEmbed, PermissionResolvable, Permissions } from 'discord.js';

export async function run (client: ReknownClient, message: Message, args: string[]) {
  const method = args[1] ? args[1].toLowerCase() : null;
  if (!method) return client.functions.noArg(message, 1, 'an action to do, either decode / encode.');
  if (method !== 'decode' && method !== 'encode') return client.functions.badArg(message, 1, 'The action provided was not a valid choice. It must be either decode or encode.');

  const input = args.slice(2).join(' ');
  if (!input) return client.functions.noArg(message, 2, 'an input to decode or encode.');

  const result = method === 'decode' ? atob(input) : btoa(input);
  if (!result) return client.functions.badArg(message, 2, 'The input provided was not a valid Base64 string.');
  if (result.length > 2048) return client.functions.badArg(message, 2, 'The output was longer than 2048 characters, which is more than a message can hold. Please shorten the input.');

  const embed = new MessageEmbed()
    .setColor(client.config.embedColor as ColorResolvable)
    .setDescription(client.escMD(result))
    .setFooter(`Successfully ${method}d! | Requested by ${message.author.tag}`, message.author.displayAvatarURL())
    .setTimestamp()
    .setTitle('Output');

  message.reply({ embeds: [ embed ]});
}

export const help: HelpObj = {
  aliases: [],
  category: 'Utility',
  desc: 'Encodes or decodes into Base64.',
  dm: true,
  togglable: true,
  usage: 'base64 <"decode"/"encode"> <Input>'
};

export const memberPerms: PermissionResolvable[] = [];

export const permissions: PermissionResolvable[] = [
  Permissions.FLAGS.EMBED_LINKS
];
