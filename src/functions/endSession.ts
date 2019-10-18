import { MusicObject } from 'ReknownBot';

module.exports = (music: MusicObject) => {
  music.queue = [];
  music.looping = false;
  music.volume = 20;
  music.player!.leave();
  music.player!.stop();
};
