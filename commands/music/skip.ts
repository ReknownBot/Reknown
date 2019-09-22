import ReknownClient from '../../structures/client';
import { Message, DMChannel } from 'discord.js';

module.exports.run = (client: ReknownClient, message: Message, args: string[]) => {
  if (message.channel instanceof DMChannel) return message.reply(':x: This command is only available in servers.');

  const music = client.music[message.guild.id];

  if (!music || !music.player || !music.player.playing) return message.reply(':x: I am not playing anything!');
  if (message.guild.voice.channelID !== message.member.voice.channelID) return message.reply(':x: You must be in the same voice channel as me to run that command.');

  music.player.stop();
  message.channel.send('Successfully skipped a song.');
};

module.exports.help = {
  aliases: [ 'skipsong' ],
  category: 'Music',
  desc: 'Skips a song.',
  usage: 'skip'
};
