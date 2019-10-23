import ReknownClient from '../../structures/client';
import fetch from 'node-fetch';
import { stringify } from 'querystring';
import { Message, MessageEmbed, TextChannel } from 'discord.js';

const sources = [
  'stable',
  'master',
  'rpc',
  'commando',
  'akairo',
  'akairo-master',
  '11.5-dev'
];

module.exports.run = async (client: ReknownClient, message: Message, args: string[]) => {
  if (message.channel instanceof TextChannel && !message.channel.permissionsFor(client.user!)!.has('EMBED_LINKS')) return client.functions.noClientPerms(message, [ 'Embed Links' ], message.channel);

  const q = args[1];
  let branch = args[2] || 'stable';
  if (!q) return client.functions.noArg(message, 1, 'a query to search for.');
  if (!sources.includes(branch.toLowerCase())) return client.functions.badArg(message, 2, `The source provided was invalid. It can be ${sources.join(', ')}.`);
  branch = branch.toLowerCase();
  if (branch === '11.5-dev') branch = `https://raw.githubusercontent.com/discordjs/discord.js/docs/${branch}.json`;

  const qstring = stringify({ q: q, src: branch });
  const raw = await fetch(`https://djsdocs.sorta.moe/v2/embed?${qstring}`).then(res => res.json());
  if (!raw) return client.functions.badArg(message, 1, 'I did not find anything with that query.');

  const embed = new MessageEmbed(raw);
  message.channel.send({ embed: embed });
};

module.exports.help = {
  aliases: [],
  category: 'Documentation',
  desc: 'Displays documentation for Discord.JS.',
  usage: 'docs <Query> [Branch]'
};
