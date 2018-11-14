module.exports = async (Client, message, args) => {
  if (!await Client.checkPerms('resume', 'music', message.member)) return message.reply(':x: Sorry, but you do not have the `music.resume` permission.');
  const server = Client.musicfn.guilds[message.guild.id];
  if (!server.isPlaying || !message.guild.me.voice.channel) return message.reply('I am not playing anything!');
  if (!server.paused) return message.reply('The song is not paused!');
  server.dispatcher.resume();
  server.paused = false;
  return message.channel.send('Successfully resumed the song.');
};

module.exports.help = {
  name: 'resume',
  desc: 'Resumes the song if a song is paused.',
  category: 'music',
  usage: '?resume',
  aliases: []
};
