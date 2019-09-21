import ReknownClient from '../../structures/client';
import { Message } from 'discord.js';

module.exports.run = (client: ReknownClient, message: Message, args: string[]) => {
  const music = client.music[message.guild.id];

  if (!music || !music.player.playing) return message.reply(':x: I am not playing anything!');
  if (message.guild.voice.channelID !== message.member.voice.channelID) return message.reply(':x: You must be in the same voice channel as me to run that command.');

  music.player.stop();
  message.channel.send('Successfully stopped the music and left the voice channel.');
};

module.exports.help = {
  aliases: [],
  category: 'Music',
  desc: 'Stops the music.',
  usage: 'stop'
};
