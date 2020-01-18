import type { HelpObj } from 'ReknownBot';
import type ReknownClient from '../../structures/client';
import type { Message, PermissionString, TextChannel } from 'discord.js';

export async function run (client: ReknownClient, message: Message & { channel: TextChannel }, args: string[]) {
  let music = client.music[message.guild!.id];
  if (!music) music = client.music[message.guild!.id] = {
    equalizer: 0,
    looping: false,
    player: undefined,
    queue: [],
    volume: 20
  };
  if (!message.member!.voice.channel) return message.reply('You must be in a voice channel to do this.');
  if (music.player && music.player.playing && message.guild!.voice!.channelID !== message.member!.voice.channelID) return message.reply('You must be in the same voice channel as me to run that command.');
  const vc = message.member!.voice.channel;
  if (!vc.permissionsFor(client.user!)!.has([ 'CONNECT', 'SPEAK' ])) return client.functions.noClientPerms(message, [ 'CONNECT', 'SPEAK' ], vc);

  if (!args[1]) return client.functions.noArg(message, 1, 'a query to search for.');
  const res = await client.lavalink!.load(`scsearch:${args.slice(1).join(' ')}`);
  if (res.loadType === 'LOAD_FAILED') return message.reply('Something went wrong while fetching the song. Please try again later.');
  const song = res.tracks[0];
  if (!song) return client.functions.badArg(message, 1, 'I did not find a song with that query.');
  if (music.queue.includes(song)) return client.functions.badArg(message, 1, 'That song is already in the queue.');
  if (music.queue.length > 15) return client.functions.badArg(message, 1, 'The queue is full! You cannot go over 15 songs at a time.');

  if (!music.player) music.player = client.lavalink!.players.get(message.guild!.id);
  if (!music.player.playing) await music.player.join(vc.id);

  client.functions.sendSong(music, message, song, client.user!);
  client.functions.playMusic(client, message.guild!, music, song);
}

export const help: HelpObj = {
  aliases: [ 'soundcloudplay' ],
  category: 'Music',
  desc: 'Searches songs from SoundCloud and plays music.',
  togglable: true,
  usage: 'scplay <Query>'
};

export const memberPerms: PermissionString[] = [];

export const permissions: PermissionString[] = [];
