import ReknownClient from '../../structures/client';
import { DMChannel, Message } from 'discord.js';

export async function run (client: ReknownClient, message: Message, args: string[]) {
  if (message.channel instanceof DMChannel) return message.reply('This command is only available in servers.');

  const music = client.music[message.guild!.id];

  if (!music || !music.player || !music.player.playing) return message.reply('I am not playing anything!');
  if (message.guild!.voice!.channelID !== message.member!.voice.channelID) return message.reply('You must be in the same voice channel as me to run that command.');

  client.functions.endSession(music);
  message.channel.send('Successfully stopped the music and left the voice channel.');
}

export const help = {
  aliases: [ 'dis', 'disconnect' ],
  category: 'Music',
  desc: 'Stops the music.',
  usage: 'stop'
};
