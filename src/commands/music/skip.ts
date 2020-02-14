import type { PermissionString } from 'discord.js';
import type ReknownClient from '../../structures/client';
import type { GuildMessage, HelpObj } from 'ReknownBot';

export async function run (client: ReknownClient, message: GuildMessage, args: string[]) {
  const music = client.music[message.guild.id];

  if (!music || !music.player || !music.player.playing) return message.reply('I am not playing anything!');
  if (message.guild.voice!.channelID !== message.member.voice.channelID) return message.reply('You must be in the same voice channel as me to run that command.');

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

export const memberPerms: PermissionString[] = [];

export const permissions: PermissionString[] = [];
