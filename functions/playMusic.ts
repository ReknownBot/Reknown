import { Guild } from 'discord.js';
import { ReknownClient, MusicObject } from 'ReknownBot';

module.exports = async (client: ReknownClient, guild: Guild, music: MusicObject, track: string, ended?: boolean) => {
  if (!ended) {
    music.queue.push(track);
    if (music.queue.length > 1) return;
  }

  music.player.play(track);

  music.player.once('event', async d => {
    if (d.reason === 'REPLACED') return;
    if (!guild.voice.channel || d.reason === 'STOPPED') return client.functions.endSession(music);
    if (music.looping) music.queue.push(music.queue.shift());
    else music.queue.shift();

    if (music.queue.length > 0) {
      await music.player.stop();
      return module.exports(client, guild, music, music.queue[0], true);
    }
    client.functions.endSession(music);
  });
};
