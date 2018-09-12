module.exports = {
  ytdl: require('ytdl-core'),
  getYouTubeID: require('get-youtube-id'),
  fetchVideoInfo: new (require('simple-youtube-api'))(process.env.YT_API_KEY),
  guilds: {},
  musicBool: {},

  async isValidYT (str) {
    try {
      await this.fetchVideoInfo.getVideo(str);
      // If it is valid
      return true;
    } catch (e) {
      // If the video is not valid
      return false;
    }
  },

  async search_video (str, Client, message) {
    // Gets five results from youtube depending on the query
    const results = await this.fetchVideoInfo.searchVideos(str, 5);

    // If there is no result
    if (!results[0]) return null;

    // Defines "guild" as the object from musicfn.guilds
    const guild = Client.musicfn.guilds[message.guild.id];

    // Updates guild.searching to true
    guild.searching = true;

    // Defines two arrays; one for names, one for IDs
    const nameArr = [];
    const idArr = [];

    // Loops through the results
    results.forEach((video, index) => {
      // Pushes into the two arrays defined earlier
      nameArr.push(`**${index + 1}. ${video.title}**`);
      idArr.push(video.id);
    });

    // Sends a message
    const msg = await message.channel.send(`Please choose by reacting to one of these results.\n\n${nameArr.join('\n')}`);

    // Defines "emojis" as an array of emoji unicodes
    const emojis = ['1⃣', '2⃣', '3⃣', '4⃣', '5⃣', '⏹'];

    // Loops through the emojis
    for (let i = 0; i < emojis.length; i++) {
      // If the message is not deleted
      if (!msg.deleted) {
        // React to the message
        await msg.react(emojis[i]);
      }
    }

    // Defines the filter for the awaitReactions
    const filter = (reaction, user) => user.id === message.author.id && emojis.includes(reaction.emoji.name);

    // Creates an await reactions
    const reactions = await msg.awaitReactions(filter, {
      time: 30000,
      max: 1
    });

    // Sets guild.searching to false
    guild.searching = false;

    // If the message still exists, delete it
    if (!msg.deleted) {
      msg.delete();
    }

    // Defines "reaction" as the reaction
    const reaction = reactions.first();

    // If there is no reaction i.e the user did not react
    if (!reaction) { return 'noR'; }

    // Defines "index" as the index position of the array of emojis
    const index = emojis.indexOf(reaction.emoji.name);

    // If the reaction collected was the stop button
    if (index === 5) { return 'stopped'; }

    // If the results were smaller than five and the index was larger than the max amount
    if (nameArr.length - 1 < index) { return 'invalid'; }

    return idArr[index];
  },

  async playMusic (id, message, Client, connection) {
    if (id.indexOf('youtube.com') === -1) id = 'https://www.youtube.com/watch?v=' + id;

    // Defines "guild" as the object from musicfn.guilds
    const guild = this.guilds[message.guild.id];

    // Gets the video info
    const video = await this.fetchVideoInfo.getVideo(id);
    guild.voiceChannel = connection.channel;
    guild.isPlaying = true;
    guild.queueIDs.push(video.id);
    guild.queueNames.push(video.title);

    // If the command was adding a song
    if (guild.queueIDs.length > 1) return;

    // Defines "dispatcher" as the returned value of VoiceConnection#play, and starts playing the music
    const dispatcher = connection.play(this.ytdl(id));

    guild.dispatcher = dispatcher;

    // Sets the volume to save lives
    dispatcher.setVolumeLogarithmic(guild.volume / 180);

    // When the song finishes
    dispatcher.on('finish', () => {
      // If looping is enabled
      if (guild.looping) {
        // Moves the first element to the last
        guild.queueIDs.push(guild.queueIDs.shift());
        guild.queueNames.push(guild.queueNames.shift());
        // If it's not on loop
      } else {
        // Removes the first element
        guild.queueIDs.shift();
        guild.queueNames.shift();
      }

      // If the queue is empty (all songs played)
      if (guild.queueIDs.length === 0) {
        // Resets all the properties to its' default values
        guild.isPlaying = false;
        guild.voiceChannel ? guild.voiceChannel.leave() : null;
        guild.voiceChannel = null;
        guild.dispatcher = null;
        guild.volume = 50;
        guild.skips = 0;
        guild.skippers = [];
        return undefined;
        // If there are still more songs to play
      } else {
        // Repeats this function
        return this.playMusic(guild.queueIDs[0], message, Client, connection);
      }
    })
      // When an error happens
      .on('error', error => {
        // Sends error info
        console.error(error);
        Client.rollbar.error('Something went wrong in commands/music/play.js', error);
        message.channel.send(`Something went wrong: \`\`\`xl\n${error}\n\`\`\``);
      });
  },

  async sendinfo (Client, message, id) {
    const guild = this.guilds[message.guild.id];
    const video = await this.fetchVideoInfo.getVideo(id);
    // If there was a song already
    if (guild.queueNames.length > 1) {
      // Creates an embed
      var embed = new Client.Discord.MessageEmbed()
        .setDescription(`Added to queue: **[${Client.Discord.Util.escapeMarkdown(video.title)}](${video.url})**`)
        .setThumbnail(video.thumbnails['high'].url)
        .setFooter(`${Client.moment().startOf('day').seconds(video.durationSeconds).format('H:mm:ss')} | Published at`)
        .setTimestamp(video.publishedAt)
        .setColor(0x00FFFF);
      // If this is a new queue
    } else {
      // Creates an embed
      var embed = new Client.Discord.MessageEmbed() // eslint-disable-line no-redeclare
        .setDescription(`Now Playing: **[${Client.Discord.Util.escapeMarkdown(video.title)}](${video.url})**`)
        .setThumbnail(video.thumbnails['high'].url)
        .setFooter(`${Client.moment().startOf('day').seconds(video.durationSeconds).format('H:mm:ss')} | Published at`)
        .setTimestamp(video.publishedAt)
        .setColor(0x00FFFF);
    }

    // Send the embed
    message.channel.send(embed);
  },

  addSkip (message) {
    const server = this.guilds[message.guild.id];
    server.skips += 1;
    server.skippers.push(message.author.id);

    if (server.skips >= Math.ceil(message.member.voice.channel.members.filter(m => !m.user.bot).size / 2)) return true;
    return false;
  }
};
