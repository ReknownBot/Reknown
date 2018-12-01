module.exports = async (Client, message, args) => {
  const guild = Client.musicfn.guilds[message.guild.id];

  if (!message.guild.me.voice.channel || !guild.isPlaying) return message.reply('I am not playing anything!');
  if (!message.member.voice.channel) return message.reply('You have to be in a voice channel to use this command!');
  if (message.member.voice.channel !== message.guild.me.voice.channel) return message.reply('You have to be in the same voice channel as me to use this command!');
  if (guild.searching) return message.reply('Someone is searching a video right now, so you cannot use that command.');

  guild.queueNames = [];
  guild.queueIDs = [];
  guild.dispatcher.end();
  return message.channel.send('Successfully stopped the song.');
};

module.exports.help = {
  name: 'stop',
  desc: 'Stops the current song playing, leaves the channel, and clears the queue.',
  category: 'music',
  usage: '?stop',
  aliases: ['disconnect']
};
