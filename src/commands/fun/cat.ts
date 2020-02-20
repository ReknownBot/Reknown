import type { HelpObj } from 'ReknownBot';
import { MessageEmbed } from 'discord.js';
import type ReknownClient from '../../structures/client';
import fetch from 'node-fetch';
import { stringify } from 'querystring';
import type { Message, PermissionString } from 'discord.js';

interface CatResult {
  breeds: string[];
  height: number;
  id: string;
  url: string;
  width: number;
}

export async function run (client: ReknownClient, message: Message, args: string[]) {
  const qs = stringify({
    limit: 1,
    size: 'small'
  });
  const json: CatResult[] = await fetch(`https://api.thecatapi.com/v1/images/search?${qs}`, {
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.THECATAPI_KEY!
    }
  }).then(res => res.json());

  const embed = new MessageEmbed()
    .setColor(client.config.embedColor)
    .setFooter(`Requested by ${message.author.tag} | Powered by https://thecatapi.com/`, message.author.displayAvatarURL())
    .setImage(json[0].url)
    .setTitle('Kitty!');

  message.channel.send(embed);
}

export const help: HelpObj = {
  aliases: [],
  category: 'Fun',
  desc: 'Shows a picture of a cat.',
  dm: true,
  togglable: true,
  usage: 'cat'
};

export const memberPerms: PermissionString[] = [];

export const permissions: PermissionString[] = [
  'EMBED_LINKS'
];
