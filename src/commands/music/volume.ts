import ReknownClient from '../../structures/client';
import { Message, DMChannel } from 'discord.js';

module.exports.run = (client: ReknownClient, message: Message, args: string[]) => {
  if (message.channel instanceof DMChannel) return message.reply('This command is only available in servers.');

  const music = client.music[message.guild!.id];

  if (!music || !music.player || !music.player.playing) return message.reply('I am not playing anything!');
  if (message.guild!.voice!.channelID !== message.member!.voice.channelID) return message.reply('You must be in the same voice channel as me to run that command.');

  if (!args[1]) return message.channel.send(`The current volume is **${music.volume}**.`);

  const volume = parseInt(args[1]);
  if (isNaN(volume)) return client.functions.badArg(message, 1, 'The provided volume was not a number.');
  if (volume < 1 || volume > 300) return client.functions.badArg(message, 1, 'The allowed range for a volume is 1-300.');

  music.player.setVolume(volume);
  message.channel.send(`Successfully set the volume to **${volume}**.`);
};

module.exports.help = {
  aliases: [ 'setvolume' ],
  category: 'Music',
  desc: 'Displays / Sets the volume.',
  usage: 'volume [New Volume]'
};
