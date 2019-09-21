import { Guild, VoiceChannel } from 'discord.js';
import { ReknownClient, MusicObject } from 'ReknownBot';

module.exports = async (client: ReknownClient, guild: Guild, vc: VoiceChannel, music: MusicObject, track: string, ended?: boolean) => {
  music.queue.push(track);
  if (!ended && music.queue.length > 1) return;

  music.player = client.lavalink.players.get(guild.id);
  await music.player.join(vc.id);
  music.player.play(track);

  music.player.once('end', () => {
    if (!guild.voice.channel) return client.functions.endSession(music);
    if (music.looping) music.queue.push(music.queue.shift());
    else music.queue.shift();

    if (music.queue.length > 0) return module.exports(client, guild, vc, music, music.queue[0], true);
    client.functions.endSession(music);
  });
};
