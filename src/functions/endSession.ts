import { MusicObject } from 'ReknownBot';

module.exports = (music: MusicObject) => {
  music.queue = [];
  music.player!.leave();
  music.player!.stop();
};
