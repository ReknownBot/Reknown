import type { PermissionString } from 'discord.js';
import type ReknownClient from '../../structures/client';
import dateformat from 'dateformat';
import { tables } from '../../Constants';
import type { GuildMessage, HelpObj, RowWarnings } from 'ReknownBot';
import { MessageEmbed, Util } from 'discord.js';

export async function run (client: ReknownClient, message: GuildMessage, args: string[]) {
  const member = args[1] ?
    await client.functions.parseMention(args[1], {
      guild: message.guild,
      type: 'member'
    }).catch(() => null) :
    message.member;
  if (!member) return client.functions.badArg(message, 1, 'The member provided does not exist.');
  if (member.user.bot) return client.functions.badArg(message, 1, 'Bots do not get any warnings.');

  const page = args[2] ? parseInt(args[2]) : 1;
  if (isNaN(page)) return client.functions.badArg(message, 2, 'The page provided was not a number.');
  if (page < 1) return client.functions.badArg(message, 2, 'The page provided is lower than one.');

  const { rows } = await client.query<RowWarnings>(`SELECT * FROM ${tables.WARNINGS} WHERE guildid = $1 AND userid = $2 ORDER BY warnedat ASC`, [ message.guild.id, member.id ]);
  if (rows.length === 0) return message.channel.send(`\`\`${client.escInline(member.user.tag)} (ID: ${member.id})\`\` has \`0\` warnings! Keep up the good work.`);

  const str = (await Promise.all(rows.map(async r => {
    const by = await client.users.fetch(r.warnedby);
    return `${rows.indexOf(r) + 1}. **${dateformat(Number(r.warnedat), 'UTC:mmm d, yyyy, h:MM:ss TT Z')}** By \`\`${client.escInline(by.tag)}\`\` for \`\`${client.escInline(r.warnreason || 'None')}\`\``;
  }))).join('\n');
  const pages = Util.splitMessage(str, { maxLength: 2048 });
  if (pages.length < page) return client.functions.badArg(message, 2, 'The page provided is out of range.');

  const embed = new MessageEmbed()
    .setColor(client.config.embedColor)
    .setDescription(pages[page - 1])
    .setFooter(`Page ${page} of ${pages.length} | Requested by ${message.author.tag}`, message.author.displayAvatarURL())
    .setThumbnail(member.user.displayAvatarURL({ dynamic: true, format: 'jpg', size: 1024 }))
    .setTitle(`Warnings of ${member.user.tag}`);

  message.channel.send(embed);
}

export const help: HelpObj = {
  aliases: [],
  category: 'Moderation',
  desc: 'Views past warnings about a member.',
  togglable: true,
  usage: 'warnings [Member] [Page=1]'
};

export const memberPerms: PermissionString[] = [];

export const permissions: PermissionString[] = [
  'EMBED_LINKS'
];
