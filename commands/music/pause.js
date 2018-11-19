module.exports = async (Client, message, args) => {
  if (!await Client.checkPerms('pause', 'music', message.member)) return message.reply(':x: Sorry, but you do not have the `music.pause` permission.');
  const server = Client.musicfn.guilds[message.guild.id];
  if (!server.isPlaying || !message.guild.me.voice.channel) return message.reply('I am not playing anything!');
  if (server.paused) return message.reply('The song is already paused!');
  server.dispatcher.pause();
  server.paused = true;
  return message.channel.send('Successfully paused the song.');
};

module.exports.help = {
  name: 'pause',
  desc: 'Pauses the current song playing.',
  category: 'music',
  usage: '?pause',
  aliases: []
};
