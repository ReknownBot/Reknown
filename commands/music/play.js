module.exports = async (Client, message, args) => {
  const voiceChannel = message.member.voice.channel;
  if (!voiceChannel) return message.reply('You have to be in a voice channel to use this!');

  const perms = voiceChannel.permissionsFor(message.client.user);
  if (!perms.has('CONNECT')) return message.reply('I do not have permissions to join the voice channel!');
  if (!perms.has('SPEAK')) return message.reply('I do not have permissions to speak in that voice channel!');

  if (!args[1]) return message.reply('You have to provide a link or a title for me to play!');

  if (Client.musicfn.guilds[message.guild.id].searching) return message.reply('Someone is using the search function right now, please wait until they finish.');

  let query = args.slice(1).join(' ');
  if (!await Client.musicfn.isValidYT(query)) query = await Client.musicfn.search_video(query, Client, message);
  if (!query) return message.reply('I did not find any results!');

  switch (query) {
    // If the search was cancelled
    case 'stopped':
      return message.reply(':ok_hand:, Cancelling search.');
    // If no reaction was collected
    case 'noR':
      return message.reply('No reaction was collected, aborting command.');
    // If the search result was invalid
    case 'invalid':
      return message.reply('That search result is invalid!');
  }

  const connection = await voiceChannel.join();
  if (query.indexOf('youtube.com') === -1) query = 'https://www.youtube.com/watch?v=' + query;

  Client.musicfn.sendinfo(Client, message, query);
  return Client.musicfn.playMusic(query, message, Client, connection);
};

module.exports.help = {
  name: 'play',
  desc: 'Plays music.',
  category: 'music',
  usage: '?play <URL, Title, or ID of video>',
  aliases: []
};
