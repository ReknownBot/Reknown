import type { HelpObj } from 'ReknownBot';
import { MessageEmbed } from 'discord.js';
import ReknownClient from '../../structures/client';
import dateformat from 'dateformat';
import { errors } from '../../Constants';
import type { Message, PermissionString } from 'discord.js';

export async function run (client: ReknownClient, message: Message, args: string[]) {
  const user = args[1] ? await client.functions.parseMention(args[1], {
    client: client,
    type: 'user'
  }).then(() => null) : message.author;
  if (!user) return client.functions.badArg(message, 1, errors.UNKNOWN_USER);
  const member = await message.guild?.members.fetch(user).catch(() => null);

  const embed = new MessageEmbed()
    .addField('Username', user.tag, true)
    .addField('Created at', dateformat(user.createdAt, 'UTC:mmm d, yyyy, h:MM:ss TT Z'), true)
    .addField('Status', `${client.emotes.get(user.presence.status)} ${user.presence.status}`, true)
    .setColor(client.config.embedColor)
    .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL())
    .setThumbnail(message.author.displayAvatarURL({ size: 512 }))
    .setTimestamp();

  const activity = user.presence.activities.find(a => a.type === 'CUSTOM_STATUS');
  if (activity) embed.addField('Custom Status', client.escMD(activity.name), true);

  if (member) {
    await message.guild!.members.fetch();
    if (member.joinedAt) embed.addField('Joined at', dateformat(member.joinedAt, 'UTC:mmm d, yyyy, h:MM:ss TT Z'), true);
    const members = message.guild!.members.cache.filter(m => Boolean(m.joinedTimestamp)).sort(({ joinedTimestamp: a }, { joinedTimestamp: b }) => b! - a!);
    embed.addField('Joined Position', members.array().indexOf(member) + 1);
  }

  message.channel.send(embed);
}

export const help: HelpObj = {
  aliases: [ 'lookup', 'profile', 'user' ],
  category: 'Miscellaneous',
  desc: 'Provides information about a user.',
  dm: true,
  togglable: true,
  usage: 'userinfo [User]'
};

export const memberPerms: PermissionString[] = [];

export const permissions: PermissionString[] = [
  'EMBED_LINKS'
];
