import ReknownClient from '../../structures/client';
import { Message, TextChannel, MessageEmbed } from 'discord.js';
import atob from 'atob';
import btoa from 'btoa';

module.exports.run = (client: ReknownClient, message: Message, args: string[]): void => {
  if (!(message.channel as TextChannel).permissionsFor(client.user).has('EMBED_LINKS')) return client.functions.noClientPerms(message, [ 'Embed Links' ], message.channel);

  const method = args[1] ? args[1].toLowerCase() : null;
  if (!method) return client.functions.noArg(message, 1, 'an action to do, either decode / encode.');
  if (method !== 'decode' && method !== 'encode') return client.functions.badArg(message, 1, 'The action provided was not a valid choice. It must be either decode or encode.');

  const input = args.slice(2).join(' ');
  if (!input) return client.functions.noArg(message, 2, 'an input to decode or encode.');

  const result = method === 'decode' ? atob(input) : btoa(input);
  if (!result) return client.functions.badArg(message, 2, 'The input provided was not a valid Base64 string.');
  if (result.length > 2048) return client.functions.badArg(message, 2, 'The output was longer than 2048 characters, which is more than a message can hold. Please shorten the input.');

  const embed = new MessageEmbed()
    .setColor(client.config.embedColor)
    .setDescription(client.escMD(result))
    .setFooter(`Successfully ${method}d! | Requested by ${message.author.tag}`, message.author.displayAvatarURL())
    .setTimestamp()
    .setTitle('Output');

  return void message.channel.send(embed);
};

module.exports.help = {
  aliases: [],
  category: 'Utility',
  desc: 'Encodes or decodes into Base64.',
  usage: 'base64 <Encode/Decode> <Input>'
};
