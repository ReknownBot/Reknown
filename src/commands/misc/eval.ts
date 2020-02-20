import type { HelpObj } from 'ReknownBot';
import { MessageEmbed } from 'discord.js';
import type ReknownClient from '../../structures/client';
import { inspect } from 'util';
import type { Message, PermissionString } from 'discord.js';

function clean (text: string): string {
  if (typeof text === 'string') return text.replace(/`/g, '`\u200b').replace(/@/g, '@\u200b');
  return text;
}

export async function run (client: ReknownClient, message: Message, args: string[]) {
  if (!args[1]) return client.functions.noArg(message, 1, 'code to evaluate.');
  const code = args.slice(1).join(' ');

  const embed = new MessageEmbed()
    .setColor(client.config.embedColor)
    .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL())
    .setTimestamp();
  try {
    let res: string | object = await eval(`(async() => {${code}})().catch(e => e);`);
    if (typeof res !== 'string') res = inspect(res);
    if (clean(res).length > 2040) res = res.slice(0, 2040);

    embed.setDescription(`\`\`\`\n${clean(res)}\n\`\`\``)
      .setTitle('SUCCESS');
  } catch (e) {
    embed.setDescription(`\`\`\`xl\n${clean(e)}\n\`\`\``)
      .setTitle('ERROR');
  }

  message.channel.send(embed);
}

export const help: HelpObj = {
  aliases: [],
  category: 'Miscellaneous',
  desc: 'Evaluates code.',
  dm: true,
  private: true,
  togglable: false,
  usage: 'eval <Code>'
};

export const memberPerms: PermissionString[] = [];

export const permissions: PermissionString[] = [
  'EMBED_LINKS'
];
