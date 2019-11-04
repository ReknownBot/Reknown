import { HelpObj } from 'ReknownBot';
import ReknownClient from '../../structures/client';
import { Message, TextChannel } from 'discord.js';

export async function run (client: ReknownClient, message: Message & { channel: TextChannel }, args: string[]) {
  const music = client.music[message.guild!.id];

  if (!music || !music.player || !music.player.playing) return message.reply('I am not playing anything!');
  if (message.guild!.voice!.channelID !== message.member!.voice.channelID) return message.reply('You must be in the same voice channel as me to run that command.');

  client.functions.endSession(music);
  message.channel.send('Successfully stopped the music and left the voice channel.');
}

export const help: HelpObj = {
  aliases: [ 'dis', 'disconnect' ],
  category: 'Music',
  desc: 'Stops the music.',
  usage: 'stop'
};
