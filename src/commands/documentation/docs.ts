import type { HelpObj } from '../../structures/commandhandler';
import { MessageEmbed } from 'discord.js';
import type ReknownClient from '../../structures/client';
import fetch from 'node-fetch';
import { stringify } from 'querystring';
import type { Message, PermissionString } from 'discord.js';

const sources = [
  'stable',
  'master',
  'rpc',
  'commando',
  'akairo',
  'akairo-master',
  '11.5-dev'
];

export async function run (client: ReknownClient, message: Message, args: string[]) {
  const q = args[1];
  let branch = args[2] || 'stable'; // eslint-disable-line @typescript-eslint/no-unnecessary-condition
  if (!q) return client.functions.noArg(message, 1, 'a query to search for.');
  if (!sources.includes(branch.toLowerCase())) {
    return client.functions.badArg(message, 2, `The source provided was invalid. It can be ${sources.join(', ')}.`);
  }

  branch = branch.toLowerCase();
  if (branch === '11.5-dev') branch = `https://raw.githubusercontent.com/discordjs/discord.js/docs/${branch}.json`;

  const qstring = stringify({ q: q, src: branch });
  const raw = await fetch(`https://djsdocs.sorta.moe/v2/embed?${qstring}`).then(res => res.json());
  if (!raw) return client.functions.badArg(message, 1, 'I did not find anything with that query.');

  const embed = new MessageEmbed(raw);
  message.channel.send({ embed: embed });
}

export const help: HelpObj = {
  aliases: [],
  category: 'Documentation',
  desc: 'Displays documentation for Discord.js',
  dm: true,
  togglable: true,
  usage: 'docs <Query> [Branch]'
};

export const memberPerms: PermissionString[] = [];

export const permissions: PermissionString[] = [
  'EMBED_LINKS'
];
