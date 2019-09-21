import ReknownClient from '../../structures/client';
import { Message } from 'discord.js';
import fetch from 'node-fetch';

interface Song {
  track: string;
  info: {
    identifier: string;
    isSeekable: boolean;
    author: string;
    length: number;
    isStream: boolean;
    position: number;
    title: string;
    uri: string;
  };
}

async function getSongs (search: string, client: ReknownClient): Promise<Song[] | null> {
  const node = client.manager.nodes.first();

  const params = new URLSearchParams();
  params.append('identifier', search);

  return fetch(`http://${node.host}:${node.port}/loadtracks?${params}`, { headers: { Authorization: node.password } })
    .then(res => res.json())
    .then(data => data.tracks)
    .catch(err => {
      console.error(err);
      return null;
    });
}

module.exports.run = async (client: ReknownClient, message: Message, args: string[]) => {
  let music = client.music[message.guild.id];
  if (!music) music = client.music[message.guild.id] = {
    looping: false,
    player: null,
    queue: [],
    volume: 10
  };
  if (!message.member.voice.channel) return message.reply(':x: You must be in a voice channel to do this.');
  if (music.player && music.player.playing && message.guild.voice.channelID !== message.member.voice.channelID) return message.reply(':x: You must be in the same voice channel as me to run that command.');
  const vc = message.member.voice.channel;
  if (!vc.permissionsFor(client.user).has([ 'CONNECT', 'SPEAK' ])) return client.functions.noClientPerms(message, [ 'Connect', 'Speak' ], vc);

  if (!args[1]) return client.functions.noArg(message, 1, 'a query to search for.');
  const songs = await getSongs(`ytsearch:${args.slice(1).join(' ')}`, client);
  if (!songs) return message.reply(':x: Something went wrong while executing the command. This error has been logged.');
  const song = songs[0];
  if (!song) return client.functions.badArg(message, 1, 'I did not find a song with that query.');
  if (music.queue.includes(song.track)) return client.functions.badArg(message, 1, 'That song is already in the queue.');
  if (music.queue.length > 15) return client.functions.badArg(message, 1, 'The queue is full! You cannot go over 15 songs at a time.');

  client.functions.playMusic(client, message.guild, vc, music, song.track);
  message.channel.send(`Playing **${song.info.title}** by ${song.info.author}.`);
};

module.exports.help = {
  aliases: [ 'playmusic' ],
  category: 'Music',
  desc: 'Plays music.',
  usage: 'play <Query>'
};
