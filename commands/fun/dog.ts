import { ReknownClient } from 'ReknownBot';
import { Message, MessageEmbed, TextChannel } from 'discord.js';
import fetch from 'node-fetch';

interface DogResult {
  message: string;
  status: string;
}

module.exports.run = async (client: ReknownClient, message: Message, args: string[]) => {
  if (message.channel instanceof TextChannel && !message.channel.permissionsFor(client.user!)!.has('EMBED_LINKS')) return client.functions.noClientPerms(message, [ 'Embed Links' ], message.channel);

  const json: DogResult = await fetch('https://dog.ceo/api/breeds/image/random').then(res => res.json());
  if (!json || json.status !== 'success') return message.reply('Seems like the API is down, please try again later. If this problem persists, let us know in our Discord server.');

  const embed = new MessageEmbed()
    .setColor(client.config.embedColor)
    .setFooter(`Requested by ${message.author.tag} | Powered by https://dog.ceo/dog-api`, message.author.displayAvatarURL())
    .setImage(json.message)
    .setTitle('Doggo!');

  message.channel.send(embed);
};

module.exports.help = {
  aliases: [],
  category: 'Fun',
  desc: 'Shows a picture of a dog.',
  usage: 'dog'
};
