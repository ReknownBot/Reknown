import ReknownClient from '../../structures/client';
import { Message, TextChannel, MessageEmbed } from 'discord.js';

function text2Binary (str: string): string {
  str = unescape(encodeURIComponent(str));

  let chr;
  const output = [];

  for (let i = 0; i < str.length; i++) {
    chr = str.charCodeAt(i).toString(2);
    while (chr.length % 8 !== 0) chr = `0${chr}`;
    output.push(chr);
  }

  return output.join(' ');
}

function binary2Text (str: string): string | boolean {
  let chr: string,
    output = '';

  for (let i = 0; i < str.length; i += 8) {
    chr = parseInt(str.substr(i, 8), 2).toString(16);
    output += `%${chr.length % 2 === 0 ? chr : `0${chr}`}`;
  }

  try {
    return decodeURIComponent(output);
  } catch (e) {
    return false;
  }
}

module.exports.run = (client: ReknownClient, message: Message, args: string[]): void => {
  if (message.channel instanceof TextChannel && !message.channel.permissionsFor(client.user).has('EMBED_LINKS')) return client.functions.noClientPerms(message, [ 'Embed Links' ], message.channel);

  const method = args[1] ? args[1].toLowerCase() : null;
  if (!method) return client.functions.noArg(message, 1, 'an action to do, either decode / encode.');
  if (method !== 'decode' && method !== 'encode') return client.functions.badArg(message, 1, 'The action provided was not a valid choice. It must be either decode or encode.');

  const input = args.slice(2).join(' ');
  if (!input) return client.functions.noArg(message, 2, 'an input to decode or encode.');

  let result: string | boolean;

  if (method === 'decode') result = binary2Text(input.replace(/\s/g, ''));
  else result = text2Binary(input);

  if (typeof result !== 'string') return client.functions.badArg(message, 2, 'The input provided was not a valid binary string.');
  if (result.length > 2048) return client.functions.badArg(message, 2, 'The output was longer than 2048 characters, which is more than a message can hold. Please shorten the input.');

  const embed = new MessageEmbed()
    .setColor(client.config.embedColor)
    .setDescription(client.escMD(result))
    .setFooter(`Successfully ${method}d! | Requested by ${message.author.tag}`, message.author.displayAvatarURL())
    .setTimestamp()
    .setTitle('Output');

  message.channel.send(embed);
};

module.exports.help = {
  aliases: [ 'binary' ],
  category: 'Utility',
  desc: 'Either decodes or encodes into binary.',
  usage: 'binary <decode/encode> <Input>'
};
