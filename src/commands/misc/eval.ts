import type { HelpObj } from '../../structures/commandhandler';
import type { Message } from 'discord.js';
import type ReknownClient from '../../structures/client';
import { inspect } from 'util';
import { ColorResolvable, MessageEmbed, PermissionResolvable, Permissions } from 'discord.js';

function clean (text: string): string {
  if (typeof text === 'string') return text.replace(/`/g, '`\u200b').replace(/@/g, '@\u200b');
  return text;
}

export async function run (client: ReknownClient, message: Message, args: string[]) {
  if (!args[1]) return client.functions.noArg(message, 1, 'code to evaluate.');
  const code = args.slice(1).join(' ');

  const embed = new MessageEmbed()
    .setColor(client.config.embedColor as ColorResolvable)
    .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL())
    .setTimestamp();
  try {
    let res = await eval(`(async() => {${code}})();`);
    if (typeof res !== 'string') res = inspect(res);
    if (clean(res).length > 2040) res = res.slice(0, 2040);

    embed.setDescription(`\`\`\`\n${clean(res)}\n\`\`\``)
      .setTitle('SUCCESS');
  } catch (e: any) {
    embed.setDescription(`\`\`\`xl\n${clean(e)}\n\`\`\``)
      .setTitle('ERROR');
  }

  message.reply({ embeds: [ embed ] });
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

export const memberPerms: PermissionResolvable[] = [];

export const permissions: PermissionResolvable[] = [
  Permissions.FLAGS.EMBED_LINKS
];
