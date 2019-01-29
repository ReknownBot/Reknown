module.exports = {
  ytdl: require('ytdl-core'),
  getYouTubeID: require('get-youtube-id'),
  fetchVideoInfo: new (require('simple-youtube-api'))(process.env.YT_API_KEY),
  guilds: {},
  musicBool: {},

  async isValidYT (str) {
    try {
      await this.fetchVideoInfo.getVideo(str);
      return true;
    } catch (e) {
      return false;
    }
  },

  async search_video (str, Client, message) {
    const results = await this.fetchVideoInfo.searchVideos(str, 5);
    if (!results[0]) return null;

    const guild = Client.musicfn.guilds[message.guild.id];
    guild.searching = true;

    const nameArr = [];
    const idArr = [];

    results.forEach((video, index) => {
      nameArr.push(`**${index + 1}. ${video.title}**`);
      idArr.push(video.id);
    });

    const msg = await message.channel.send(`Please choose by reacting to one of these results.\n\n${nameArr.join('\n')}`);

    const emojis = ['1⃣', '2⃣', '3⃣', '4⃣', '5⃣', '⏹'];

    for (let i = 0; i < emojis.length; i++) {
      if (!msg.deleted) await msg.react(emojis[i]);
    }

    const filter = (reaction, user) => user.id === message.author.id && emojis.includes(reaction.emoji.name);

    const reactions = await msg.awaitReactions(filter, {
      time: 30000,
      max: 1
    });

    guild.searching = false;

    if (!msg.deleted) msg.delete();

    const reaction = reactions.first();
    if (!reaction) return 'noR';

    const index = emojis.indexOf(reaction.emoji.name);
    if (index === 5) { return 'stopped'; }
    if (nameArr.length - 1 < index) { return 'invalid'; }

    return idArr[index];
  },

  async playMusic (id, message, Client, connection) {
    if (id.indexOf('youtube.com') === -1 && id.indexOf('youtu.be') === -1) id = 'https://www.youtube.com/watch?v=' + id;

    const guild = this.guilds[message.guild.id];

    const video = await this.fetchVideoInfo.getVideo(id);
    guild.voiceChannel = connection.channel;
    guild.isPlaying = true;
    guild.queueIDs.push(video.id);
    guild.queueNames.push(video.title);

    if (guild.queueIDs.length > 1) return;

    const dispatcher = connection.play(this.ytdl(id, { filter: 'audioonly', quality: 'highest' }));

    guild.dispatcher = dispatcher;
    dispatcher.setVolumeLogarithmic(guild.volume / 175);

    dispatcher.on('finish', () => {
      if (guild.looping) {
        guild.queueIDs.push(guild.queueIDs.shift());
        guild.queueNames.push(guild.queueNames.shift());
      } else {
        guild.queueIDs.shift();
        guild.queueNames.shift();
      }

      if (guild.queueIDs.length === 0) {
        guild.isPlaying = false;
        guild.voiceChannel ? guild.voiceChannel.leave() : null;
        guild.voiceChannel = null;
        guild.dispatcher = null;
        guild.volume = 50;
        guild.skips = 0;
        guild.skippers = [];
        return undefined;
      } else return this.playMusic(guild.queueIDs[0], message, Client, connection);
    }).on('error', error => {
      console.error(error);
      Client.rollbar.error('Something went wrong in commands/music/play.js', error);
      message.channel.send(`Something went wrong: \`\`\`xl\n${error}\n\`\`\``);
    });
  },

  async sendinfo (Client, message, id) {
    const guild = this.guilds[message.guild.id];
    const video = await this.fetchVideoInfo.getVideo(id);
    const embed = new Client.Discord.MessageEmbed()
      .setColor(0x00FFFF)
      .setTimestamp(video.publishedAt)
      .setFooter(`${Client.moment().startOf('day').seconds(video.durationSeconds).format('H:mm:ss')} | Published at`)
      .setThumbnail(video.thumbnails['high'].url);
    if (guild.queueNames.length > 1) {
      embed.setDescription(`Added to queue: **[${Client.Discord.Util.escapeMarkdown(video.title)}](${video.url})**\n\nRequested by ${message.author}`);
    } else {
      embed.setDescription(`Now Playing: **[${Client.Discord.Util.escapeMarkdown(video.title)}](${video.url})**\n\nRequested by ${message.author}`);
    }

    return message.channel.send(embed);
  },

  addSkip (message) {
    const server = this.guilds[message.guild.id];
    server.skips += 1;
    server.skippers.push(message.author.id);

    if (server.skips >= Math.ceil(message.member.voice.channel.members.filter(m => !m.user.bot).size / 2)) return true;
    return false;
  }
};
