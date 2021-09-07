import type { HelpObj } from '../../structures/CommandHandler';
import ReknownClient from '../../structures/Client';
import dateformat from 'dateformat';
import { ColorResolvable, MessageEmbed, PermissionResolvable, Permissions } from 'discord.js';
import { GuildMessage, errors } from '../../Constants';

export async function run (client: ReknownClient, message: GuildMessage, args: string[]) {
  const member = args[1] ?
    await client.functions.parseMention(args[1], {
      guild: message.guild,
      type: 'member'
    }).catch(() => null) :
    message.member;
  if (!member) return client.functions.badArg(message, 1, errors.UNKNOWN_USER);

  const embed = new MessageEmbed()
    .addFields([
      {
        inline: true,
        name: 'Username',
        value: member.user.tag
      },
      {
        inline: true,
        name: 'Created at',
        value: dateformat(member.user.createdAt, 'UTC:mmm d, yyyy, h:MM:ss TT Z')
      }
    ])
    .setColor(client.config.embedColor as ColorResolvable)
    .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL())
    .setThumbnail(member.user.displayAvatarURL({ size: 512 }))
    .setTimestamp();

  if (member.presence !== null) {
    embed.addFields({
      inline: true,
      name: 'Status',
      value: `${client.emotes.get(member.presence.status)} ${member.presence.status}`
    });
    for (const activity of member.presence.activities) {
      if (activity.type === 'CUSTOM' && activity.state) embed.addField('Custom Status', client.escMD(activity.state), true);
      else {
        const field = embed.fields.find(f => f.name === 'Activity');
        if (field) embed.spliceFields(embed.fields.indexOf(field), 1, [{ inline: true, name: field.name, value: `${field.value}\n- \`\`${client.escInline(activity.name)}\`\`` }]);
        else embed.addField('Activity', `- \`\`${client.escInline(activity.name)}\`\``, true);
      }
    }
  }

  if (member) {
    await message.guild.members.fetch();
    if (member.joinedAt) embed.addField('Joined at', dateformat(member.joinedAt, 'UTC:mmm d, yyyy, h:MM:ss TT Z'), true);
    const members = message.guild.members.cache.filter(m => Boolean(m.joinedTimestamp)).sort(({ joinedTimestamp: a }, { joinedTimestamp: b }) => a! - b!);
    embed.addField('Joined Position', `#${[ ...members.values() ].indexOf(member) + 1}`);
  }

  message.reply({ embeds: [ embed ]});
}

export const help: HelpObj = {
  aliases: [ 'lookup', 'profile', 'user' ],
  category: 'Miscellaneous',
  desc: 'Provides information about a user.',
  togglable: true,
  usage: 'userinfo [User]'
};

export const memberPerms: PermissionResolvable[] = [];

export const permissions: PermissionResolvable[] = [
  Permissions.FLAGS.EMBED_LINKS
];
