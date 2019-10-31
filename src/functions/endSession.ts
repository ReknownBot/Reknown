import { MusicObject } from 'ReknownBot';

export function run (music: MusicObject) {
  music.queue = [];
  music.player!.leave();
  music.player!.stop();
}
