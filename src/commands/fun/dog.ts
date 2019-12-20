import { HelpObj } from 'ReknownBot';
import ReknownClient from '../../structures/client';
import fetch from 'node-fetch';
import { Message, MessageEmbed, PermissionString } from 'discord.js';

interface DogResult {
  message: string;
  status: string;
}

export async function run (client: ReknownClient, message: Message, args: string[]) {
  const json: DogResult = await fetch('https://dog.ceo/api/breeds/image/random').then(res => res.json());
  if (!json || json.status !== 'success') return message.reply('Seems like the API is down, please try again later. If this problem persists, let us know in our Discord server.');

  const embed = new MessageEmbed()
    .setColor(client.config.embedColor)
    .setFooter(`Requested by ${message.author.tag} | Powered by https://dog.ceo/dog-api`, message.author.displayAvatarURL())
    .setImage(json.message)
    .setTitle('Doggo!');

  message.channel.send(embed);
}

export const help: HelpObj = {
  aliases: [],
  category: 'Fun',
  desc: 'Shows a picture of a dog.',
  dm: true,
  togglable: true,
  usage: 'dog'
};

export const permissions: PermissionString[] = [
  'EMBED_LINKS'
];
