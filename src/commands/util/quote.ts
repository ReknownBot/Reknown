import type { HelpObj } from 'ReknownBot';
import type { PermissionString } from 'discord.js';
import type ReknownClient from '../../structures/client';
import { Message, MessageEmbed, TextChannel } from 'discord.js';

const regex = /(?:discordapp.com\/channels)\/(?:(\d{17,19})\/(\d{17,19})\/(\d{17,19}))/;

export async function run (client: ReknownClient, message: Message, args: string[]) {
  if (!args[1]) return client.functions.noArg(message, 1, 'a message URL to quote.');
  if (!regex.test(args[1])) return client.functions.badArg(message, 1, 'The provided argument was not a message URL.');
  const res = args[1].match(regex)!.slice(1);

  const guild = client.guilds.get(res[0]);
  if (!guild) return client.functions.badArg(message, 1, 'I am not in that server! I must be in the server to quote a message from it.');
  const channel = guild.channels.get(res[1]);
  if (!channel) return client.functions.badArg(message, 1, 'The provided channel does not exist.');
  if (!(channel instanceof TextChannel)) return client.functions.badArg(message, 1, 'The provided channel must be a text channel.');
  if (!channel.permissionsFor(client.user!)!.has([ 'READ_MESSAGE_HISTORY', 'VIEW_CHANNEL' ])) return client.functions.noClientPerms(message, [ 'READ_MESSAGE_HISTORY', 'VIEW_CHANNEL' ], channel);
  if (!channel.permissionsFor(message.author!)!.has([ 'READ_MESSAGE_HISTORY', 'VIEW_CHANNEL' ])) return client.functions.noPerms(message, [ 'READ_MESSAGE_HISTORY', 'VIEW_CHANNEL' ], channel);

  const msg = await channel.messages.fetch(res[2]).catch(() => null);
  if (!msg) return client.functions.badArg(message, 1, 'I did not find the message provided.');

  let img = msg.attachments.first();
  if (img && !img.height) img = undefined;

  const embed = new MessageEmbed()
    .setColor(client.config.embedColor)
    .setDescription(msg.content)
    .setImage(img ? img.url : '')
    .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL())
    .setTimestamp()
    .setTitle('Successfully quoted message!');

  message.channel.send(embed);
}

export const help: HelpObj = {
  aliases: [ 'quotemessage' ],
  category: 'Utility',
  desc: 'Quotes a message. You must have access to the channel.',
  dm: true,
  togglable: true,
  usage: 'quote <Message URL>'
};

export const memberPerms: PermissionString[] = [];

export const permissions: PermissionString[] = [
  'EMBED_LINKS'
];
