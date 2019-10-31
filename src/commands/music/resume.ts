import ReknownClient from '../../structures/client';
import { DMChannel, Message } from 'discord.js';

export async function run (client: ReknownClient, message: Message, args: string[]) {
  if (message.channel instanceof DMChannel) return message.reply('This command is only available in servers.');

  const music = client.music[message.guild!.id];

  if (!music || !music.player || !music.player.playing && !music.player.paused) return message.reply('I am not playing anything!.');
  if (!music.player.paused) return message.reply('The music is not paused.');
  if (message.guild!.voice!.channelID !== message.member!.voice.channelID) return message.reply('You must be in the same voice channel as me to run that command.');

  music.player.pause(false);
  message.channel.send('Successfully resumed the music.');
}

export const help = {
  aliases: [ 'resumemusic' ],
  category: 'Music',
  desc: 'Resumes the music.',
  usage: 'resume'
};
