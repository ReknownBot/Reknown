import ReknownClient from '../../structures/client';
import { Message, DMChannel } from 'discord.js';

module.exports.run = async (client: ReknownClient, message: Message, args: string[]) => {
  if (message.channel instanceof DMChannel) return message.reply(':x: This command is only available in servers.');

  let music = client.music[message.guild!.id];
  if (!music) music = client.music[message.guild!.id] = {
    equalizer: 0,
    looping: false,
    player: undefined,
    queue: [],
    volume: 20
  };
  if (!message.member!.voice.channel) return message.reply(':x: You must be in a voice channel to do this.');
  if (music.player && music.player.playing && message.guild!.voice!.channelID !== message.member!.voice.channelID) return message.reply(':x: You must be in the same voice channel as me to run that command.');
  const vc = message.member!.voice.channel;
  if (!vc.permissionsFor(client.user!)!.has([ 'CONNECT', 'SPEAK' ])) return client.functions.noClientPerms(message, [ 'Connect', 'Speak' ], vc);

  if (!args[1]) return client.functions.noArg(message, 1, 'a query to search for.');
  const res = await client.lavalink!.load(`scsearch:${args.slice(1).join(' ')}`);
  if (!res) return message.reply(':x: Something went wrong while executing the command. This error has been logged.');
  const song = res.tracks[0];
  if (!song) return client.functions.badArg(message, 1, 'I did not find a song with that query.');
  if (music.queue.includes(song)) return client.functions.badArg(message, 1, 'That song is already in the queue.');
  if (music.queue.length > 15) return client.functions.badArg(message, 1, 'The queue is full! You cannot go over 15 songs at a time.');

  if (!music.player) music.player = client.lavalink!.players.get(message.guild!.id);
  if (!music.player.playing) await music.player.join(vc.id);

  client.functions.sendSong(music, message, song, client.user!);
  client.functions.playMusic(client, message.guild!, music, song);
};

module.exports.help = {
  aliases: [ 'soundcloudplay' ],
  category: 'Music',
  desc: 'Searches songs from SoundCloud and plays music.',
  usage: 'scplay <Query>'
};
