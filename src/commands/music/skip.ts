import { HelpObj } from 'ReknownBot';
import ReknownClient from '../../structures/client';
import { Message, PermissionString, TextChannel } from 'discord.js';

export async function run (client: ReknownClient, message: Message & { channel: TextChannel }, args: string[]) {
  const music = client.music[message.guild!.id];

  if (!music || !music.player || !music.player.playing) return message.reply('I am not playing anything!');
  if (message.guild!.voice!.channelID !== message.member!.voice.channelID) return message.reply('You must be in the same voice channel as me to run that command.');

  music.player.stop();
  message.channel.send('Successfully skipped a song.');
}

export const help: HelpObj = {
  aliases: [ 'skipsong' ],
  category: 'Music',
  desc: 'Skips a song.',
  togglable: true,
  usage: 'skip'
};

export const permissions: PermissionString[] = [];
