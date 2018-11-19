module.exports = async (Client, message, args) => {
  if (!Client.musicfn.guilds[message.guild.id].isPlaying || !message.guild.me.voice.channel) return message.reply('I am not playing anything!');

  const vidInfo = await Client.musicfn.fetchVideoInfo.getVideoByID(Client.musicfn.guilds[message.guild.id].queueIDs[0]);
  const embed = new Client.Discord.MessageEmbed()
    .setTitle(`Now Playing: ${Client.escapeMarkdown(vidInfo.title)}`)
    .setURL(vidInfo.shortURL)
    .setThumbnail(vidInfo.thumbnails['high'].url)
    .setFooter(`${Client.moment().startOf('day').seconds(vidInfo.durationSeconds).format('H:mm:ss')} | Published at`)
    .setTimestamp(vidInfo.publishedAt)
    .setColor(0x00FFFF);

  return message.channel.send(embed);
};

module.exports.help = {
  name: 'nowplaying',
  desc: 'Displays the song that is currently playing.',
  category: 'music',
  usage: '?nowplaying',
  aliases: ['np']
};
