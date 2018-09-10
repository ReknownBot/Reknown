module.exports = async (Client, message, args) => {
  const server = Client.musicfn.guilds[message.guild.id];
  if (!server.isPlaying || !message.guild.me.voice.channel) return message.reply('I am not playing anything!');
  if (!message.member.voice.channel) return message.reply('You have to be in a voice channel to use this command!');
  if (message.member.voice.channel !== message.guild.me.voice.channel) return message.reply('You have to be in the same voice channel as me to use that command!');

  const regex = new RegExp('--force', 'g');

  if (!Client.matchInArray(regex, args)) {
    const skipped = Client.musicfn.addSkip(message);
    if (skipped) {
      server.dispatcher.end();
      return message.channel.send('Successfully skipped the song.');
    } else return message.channel.send(`Your skip has been acknowledged. The song needs **${Math.ceil(message.member.voice.channel.members.filter(m => !m.user.bot).size / 2)}** more skips!`);
  } else {
    if (!await Client.checkPerms('fskip', 'music', message.member)) return message.reply(':x: Sorry, but you do not have the `music.fskip` permission.');
    server.dispatcher.end();
    return message.channel.send('Successfully force skipped the song.');
  }
};

module.exports.help = {
  name: 'skip',
  desc: 'Skips the current song playing. Will require a vote if the `force` option is not called.',
  category: 'music',
  usage: '?skip [--<option>]',
  options: {
    force: 'Force skips the song, this makes it so a vote is not required.'
  },
  aliases: []
};
