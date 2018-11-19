module.exports = async (Client, message, args) => {
  const guild = require('../../functions/music.js').guilds[message.guild.id];
  if (guild.isPlaying !== true || !message.guild.me.voice.channel) return message.reply('I am not playing anything right now!');
  if (message.member.voice.channel !== message.guild.me.voice.channel) return message.reply('You have to be in the same voice channel as me!');

  if (!args[1]) return message.channel.send(`The volume is: **${guild.volume}**`, message);

  const number = args[1];
  if (isNaN(number)) return message.reply('The value has to be a number!');
  if (number > 500 || number < 1) return message.reply('The value has to be in between 1 and 500!');

  const connection = message.guild.me.voice.channel.connection;
  connection.dispatcher.setVolumeLogarithmic(number / 180);
  guild.volume = number;
  return message.channel.send(`Successfully changed the volume to **${number}**.`);
};

module.exports.help = {
  name: 'volume',
  desc: 'Sets the volume for music.',
  category: 'music',
  usage: '?volume <Amount>',
  aliases: []
};
