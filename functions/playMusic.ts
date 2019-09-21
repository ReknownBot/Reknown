import { Guild, VoiceChannel } from 'discord.js';
import { ReknownClient, MusicObject } from 'ReknownBot';

module.exports = async (client: ReknownClient, guild: Guild, vc: VoiceChannel, music: MusicObject, track: string) => {
  music.queue.push(track);
  if (music.queue.length > 1) return;

  music.player = await client.manager.join({
    guild: guild.id,
    channel: vc.id,
    host: 'localhost'
  });

  music.player.volume(music.volume);
  music.player.play(track);

  music.player.once('error', console.error);
  music.player.once('end', (data: { reason: string }) => {
    if (data.reason === 'REPLACED') return;

    if (!guild.me.voice.channel && music.queue.length === 1) return client.functions.endSession(music, client);
    if (music.looping) music.queue.push(music.queue.shift());
    else music.queue.shift();

    if (music.queue.length > 0) return this.exports(client, guild, vc, music, music.queue[0]);
    client.functions.endSession(music, client);
  });
};
