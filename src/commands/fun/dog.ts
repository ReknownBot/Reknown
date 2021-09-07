import type { HelpObj } from '../../structures/CommandHandler';
import type { Message } from 'discord.js';
import type ReknownClient from '../../structures/Client';
import fetch from 'node-fetch';
import { ColorResolvable, MessageEmbed, PermissionResolvable, Permissions } from 'discord.js';

interface DogResult {
  message: string;
  status: string;
}

export async function run (client: ReknownClient, message: Message, args: string[]) {
  const json = await fetch('https://dog.ceo/api/breeds/image/random').then(res => res.json()) as DogResult;
  if (json.status !== 'success') return message.reply('Seems like the API is down, please try again later. If this problem persists, let us know in our Discord server.');

  const embed = new MessageEmbed()
    .setColor(client.config.embedColor as ColorResolvable)
    .setFooter(`Requested by ${message.author.tag} | Powered by https://dog.ceo/dog-api`, message.author.displayAvatarURL())
    .setImage(json.message)
    .setTitle('Doggo!');

  message.reply({ embeds: [ embed ]});
}

export const help: HelpObj = {
  aliases: [],
  category: 'Fun',
  desc: 'Shows a picture of a dog.',
  dm: true,
  togglable: true,
  usage: 'dog'
};

export const memberPerms: PermissionResolvable[] = [];

export const permissions: PermissionResolvable[] = [
  Permissions.FLAGS.EMBED_LINKS
];
