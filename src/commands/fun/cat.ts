import type { HelpObj } from '../../structures/CommandHandler';
import type { Message } from 'discord.js';
import type ReknownClient from '../../structures/Client';
import { URLSearchParams } from 'url';
import fetch from 'node-fetch';
import { ColorResolvable, MessageEmbed, PermissionResolvable, Permissions } from 'discord.js';

interface CatResult {
  breeds: string[];
  height: number;
  id: string;
  url: string;
  width: number;
}

export async function run (client: ReknownClient, message: Message, args: string[]) {
  const qstring = new URLSearchParams();
  qstring.append('limit', '1');
  qstring.append('size', 'small');
  const json = await fetch(`https://api.thecatapi.com/v1/images/search?${qstring}`, {
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.THECATAPI_KEY!
    }
  }).then(res => res.json()) as CatResult[];

  const embed = new MessageEmbed()
    .setColor(client.config.embedColor as ColorResolvable)
    .setFooter(`Requested by ${message.author.tag} | Powered by https://thecatapi.com/`, message.author.displayAvatarURL())
    .setImage(json[0].url)
    .setTitle('Kitty!');

  message.reply({ embeds: [ embed ]});
}

export const help: HelpObj = {
  aliases: [],
  category: 'Fun',
  desc: 'Shows a picture of a cat.',
  dm: true,
  togglable: true,
  usage: 'cat'
};

export const memberPerms: PermissionResolvable[] = [];

export const permissions: PermissionResolvable[] = [
  Permissions.FLAGS.EMBED_LINKS
];
