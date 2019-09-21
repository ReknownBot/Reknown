import { MusicObject } from 'ReknownBot';
import ReknownClient from '../structures/client';
import { VoiceChannel } from 'discord.js';

module.exports = (music: MusicObject, client: ReknownClient) => {
  music.queue = [];
  music.looping = false;
  music.volume = 10;
  const vc = client.channels.get(music.player.channel) as VoiceChannel;
  if (vc && vc.members.has(client.user.id)) vc.leave();
  music.player.stop();
  music.player = null;
};
