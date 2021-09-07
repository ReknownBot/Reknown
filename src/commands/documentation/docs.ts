import type { HelpObj } from '../../structures/CommandHandler';
import type { Message } from 'discord.js';
import type ReknownClient from '../../structures/Client';
import { URLSearchParams } from 'url';
import fetch from 'node-fetch';
import { MessageEmbed, PermissionResolvable, Permissions } from 'discord.js';

export async function run (client: ReknownClient, message: Message, args: string[]) {
  const q = args[1];
  let source = args[2] || 'stable';
  if (!q) return client.functions.noArg(message, 1, 'a query to search for.');

  source = source.toLowerCase();
  if (source === '11.5-dev') source = `https://raw.githubusercontent.com/discordjs/discord.js/docs/${source}.json`;

  const qstring = new URLSearchParams();
  qstring.append('q', q);
  qstring.append('src', source);
  const raw: any = await fetch(`https://djsdocs.sorta.moe/v2/embed?${qstring}`).then(res => res.json());
  if (!raw) return client.functions.badArg(message, 1, 'I did not find anything with that query.');
  if (raw.message === 'Couldn\'t find/parse given source.') return client.functions.badArg(message, 2, 'The source provided was invalid.');

  const embed = new MessageEmbed(raw);
  message.reply({ embeds: [ embed ]});
}

export const help: HelpObj = {
  aliases: [],
  category: 'Documentation',
  desc: 'Displays documentation for Discord.js',
  dm: true,
  togglable: true,
  usage: 'docs <Query> [Source]'
};

export const memberPerms: PermissionResolvable[] = [];

export const permissions: PermissionResolvable[] = [
  Permissions.FLAGS.EMBED_LINKS
];
