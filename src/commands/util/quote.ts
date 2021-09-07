import type { HelpObj } from '../../structures/CommandHandler';
import type ReknownClient from '../../structures/Client';
import type { CategoryChannel, Message, TextChannel, VoiceChannel } from 'discord.js';
import { ColorResolvable, MessageEmbed, PermissionResolvable, Permissions } from 'discord.js';

const regex = /discordapp.com\/channels\/(\d{17,19})\/(\d{17,19})\/(\d{17,19})/;

export async function run (client: ReknownClient, message: Message, args: string[]) {
  if (!args[1]) return client.functions.noArg(message, 1, 'a message URL to quote.');
  if (!regex.test(args[1])) return client.functions.badArg(message, 1, 'The provided argument was not a message URL.');
  const res = args[1].match(regex)!.slice(1);

  const guild = client.guilds.cache.get(res[0]);
  if (!guild) return client.functions.badArg(message, 1, 'I am not in that server! I must be in the server to quote a message from it.');
  const channel = guild.channels.cache.get(res[1]) as CategoryChannel | VoiceChannel | TextChannel | undefined;
  if (!channel) return client.functions.badArg(message, 1, 'The provided channel does not exist.');
  if (channel.type !== 'GUILD_TEXT') return client.functions.badArg(message, 1, 'The provided channel must be a text channel.');

  if (!channel.permissionsFor(client.user!)!.has([ Permissions.FLAGS.READ_MESSAGE_HISTORY, Permissions.FLAGS.VIEW_CHANNEL ])) {
    return client.functions.noClientPerms(message, [ Permissions.FLAGS.READ_MESSAGE_HISTORY, Permissions.FLAGS.VIEW_CHANNEL ], channel);
  }

  if (!channel.permissionsFor(message.author)!.has([ Permissions.FLAGS.READ_MESSAGE_HISTORY, Permissions.FLAGS.VIEW_CHANNEL ])) {
    return client.functions.noPerms(message, [ Permissions.FLAGS.READ_MESSAGE_HISTORY, Permissions.FLAGS.VIEW_CHANNEL ], channel);
  }

  const msg = await channel.messages.fetch(res[2]).catch(() => null);
  if (!msg) return client.functions.badArg(message, 1, 'I did not find the message provided.');

  let img = msg.attachments.first();
  if (img && !img.height) img = undefined;

  const embed = new MessageEmbed()
    .setColor(client.config.embedColor as ColorResolvable)
    .setDescription(msg.content)
    .setImage(img ? img.url : '')
    .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL())
    .setTimestamp()
    .setTitle('Successfully quoted message!');

  message.reply({ embeds: [ embed ]});
}

export const help: HelpObj = {
  aliases: [ 'quotemessage' ],
  category: 'Utility',
  desc: 'Quotes a message. You must have access to the channel.',
  dm: true,
  togglable: true,
  usage: 'quote <Message URL>'
};

export const memberPerms: PermissionResolvable[] = [];

export const permissions: PermissionResolvable[] = [
  'EMBED_LINKS'
];
