import type { HelpObj } from '../../structures/commandhandler';
import { MessageEmbed } from 'discord.js';
import type ReknownClient from '../../structures/client';
import { errors } from '../../Constants';
import type { Message, PermissionString } from 'discord.js';

export async function run (client: ReknownClient, message: Message, args: string[]) {
  const user = args[1]
    ? await client.functions.parseMention(args[1], {
      client: client,
      type: 'user'
    }).catch(() => null)
    : message.author;
  if (!user) return client.functions.badArg(message, 1, errors.UNKNOWN_USER);

  const embed = new MessageEmbed()
    .setColor(client.config.embedColor)
    .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL())
    .setImage(user.displayAvatarURL({ dynamic: true, format: 'jpg', size: 2048 }))
    .setTimestamp()
    .setTitle(`${user.id === message.author.id ? 'Your' : `${user.tag}'s`} Avatar`);

  message.channel.send(embed);
}

export const help: HelpObj = {
  aliases: [ 'pfp', 'profilepic' ],
  category: 'Miscellaneous',
  desc: 'Displays a user\'s profile picture.',
  dm: true,
  togglable: true,
  usage: 'avatar [User]'
};

export const memberPerms: PermissionString[] = [];

export const permissions: PermissionString[] = [
  'EMBED_LINKS'
];
