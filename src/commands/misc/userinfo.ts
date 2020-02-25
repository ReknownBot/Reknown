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
  }).catch(() => null) : message.author;
  if (!user) return client.functions.badArg(message, 1, errors.UNKNOWN_USER);
  const member = await message.guild?.members.fetch(user).catch(() => null);

  const embed = new MessageEmbed()
    .addFields([
      {
        inline: true,
        name: 'Username',
        value: user.tag
      },
      {
        inline: true,
        name: 'Created at',
        value: dateformat(user.createdAt, 'UTC:mmm d, yyyy, h:MM:ss TT Z')
      },
      {
        inline: true,
        name: 'Status',
        value: `${client.emotes.get(user.presence.status)} ${user.presence.status}`
      }
    ])
    .setColor(client.config.embedColor)
    .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL())
    .setThumbnail(user.displayAvatarURL({ size: 512 }))
    .setTimestamp();

  for (const activity of user.presence.activities) {
    if (activity.type === 'CUSTOM_STATUS' && activity.state) embed.addFields([ { inline: true, name: 'Custom Status', value: client.escMD(activity.state) } ]);
    else {
      const field = embed.fields.find(f => f.name === 'Activity');
      if (field) embed.spliceFields(embed.fields.indexOf(field), 1, [ { inline: true, name: field.name, value: `${field.value}\n- \`\`${client.escInline(activity.name)}\`\`` } ]);
      else embed.addFields([ { inline: true, name: 'Activity', value: `- \`\`${client.escInline(activity.name)}\`\`` } ]);
    }
  }

  if (member) {
    await message.guild!.members.fetch();
    if (member.joinedAt) embed.addFields([ { inline: true, name: 'Joined at', value: dateformat(member.joinedAt, 'UTC:mmm d, yyyy, h:MM:ss TT Z') } ]);
    const members = message.guild!.members.cache.filter(m => Boolean(m.joinedTimestamp)).sort(({ joinedTimestamp: a }, { joinedTimestamp: b }) => a! - b!);
    embed.addFields([ { name: 'Joined Position', value: `#${members.array().indexOf(member) + 1}` } ]);
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
