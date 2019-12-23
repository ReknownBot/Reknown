import { HelpObj } from 'ReknownBot';
import ReknownClient from '../../structures/client';
import fetch from 'node-fetch';
import { Message, MessageEmbed, PermissionString } from 'discord.js';

interface CatResult {
  file: string;
}

export async function run (client: ReknownClient, message: Message, args: string[]) {
  const json: CatResult = await fetch('https://aws.random.cat/meow').then(res => res.json());
  if (!json || !json.file) return message.reply('Seems like the API is down, please try again later. If this problem persists, let us know in our Discord server.');

  const embed = new MessageEmbed()
    .setColor(client.config.embedColor)
    .setFooter(`Requested by ${message.author.tag} | Powered by https://aws.random.cat/`, message.author.displayAvatarURL())
    .setImage(json.file)
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
