import ReknownClient from '../../structures/client';
import fetch from 'node-fetch';
import { Message, MessageEmbed, TextChannel } from 'discord.js';

interface DogResult {
  message: string;
  status: string;
}

export async function run (client: ReknownClient, message: Message, args: string[]) {
  if (message.channel instanceof TextChannel && !message.channel.permissionsFor(client.user!)!.has('EMBED_LINKS')) return client.functions.noClientPerms(message, [ 'Embed Links' ], message.channel);

  const json: DogResult = await fetch('https://dog.ceo/api/breeds/image/random').then(res => res.json());
  if (!json || json.status !== 'success') return message.reply('Seems like the API is down, please try again later. If this problem persists, let us know in our Discord server.');

  const embed = new MessageEmbed()
    .setColor(client.config.embedColor)
    .setFooter(`Requested by ${message.author.tag} | Powered by https://dog.ceo/dog-api`, message.author.displayAvatarURL())
    .setImage(json.message)
    .setTitle('Doggo!');

  message.channel.send(embed);
}

export const help = {
  aliases: [],
  category: 'Fun',
  desc: 'Shows a picture of a dog.',
  usage: 'dog'
};
