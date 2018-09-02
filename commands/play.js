module.exports = {
    help: "Plays music! `Usage: ?play <YT Video Title or Link>`",
    func: async (client, message, args, unknownCommand, mess, sql, Discord, fs, PREFIX, bool) => {
            try {
                async function playcmd(sMessage) {
                    let guild = client.guilds[message.guild.id];
                    async function first() {
                        guild.isPlaying = true;
                        guild.thingy = false;
                        guild.voiceChannel = message.member.voice.channel;
                        client.getID(args.slice(1).join(' '), async function (id, playlist, name, done = false, queueEmpty) {
                            const videoInfo = await client.youtube.getVideoByID(id);
                            if (!queueEmpty) {
                                let connection = await guild.voiceChannel.join();
                                client.playMusic(id, message, connection);
                                let hours = Math.floor(videoInfo.durationSeconds / 60 / 60);
                                let minutes = Math.floor(videoInfo.durationSeconds / 60 % 60).toString().length === 2 ? Math.floor(videoInfo.durationSeconds / 60 % 60) : "0" + Math.floor(videoInfo.durationSeconds / 60 % 60).toString();
                                let seconds = Math.floor(videoInfo.durationSeconds % 60).toString().length === 2 ? Math.floor(videoInfo.durationSeconds % 60) : "0" + Math.floor(videoInfo.durationSeconds % 60);
                                if (!playlist) {
                                    if (!message.member.voice.channel) {
                                        guild.voiceChannel = null;
                                        return client.editMsg(sMessage, "You have to be in a voice channel!", message);
                                    }
                                    let embed = new Discord.MessageEmbed()
                                        .setDescription(`Now Playing: **[${videoInfo.title}](${videoInfo.url})**`)
                                        .setThumbnail(videoInfo.thumbnails['high'].url)
                                        .setFooter(`${hours}:${minutes}:${seconds} | Published at`)
                                        .setTimestamp(videoInfo.publishedAt)
                                        .setColor(0x00FFFF);
                                    guild.queueNames.push(videoInfo.title);
                                    guild.queue.push("placeholder");
                                    client.editMsg(sMessage, embed, message);
                                } else {
                                    if (!message.member.voice.channel) {
                                        guild.voiceChannel = null;
                                        return client.editMsg(sMessage, "You have to be in a voice channel!", message);
                                    }
                                    guild.queueNames.push(videoInfo.title);
                                    guild.queue.push("placeholder");
                                    if (done)
                                        client.editMsg(sMessage, `Now playing the playlist **${name}**.`, message);
                                }
                            } else {
                                client.add_to_queue(id, message);
                                guild.queueNames.push(videoInfo.title);
                            }
                        }, message);
                    }

                    async function second() {
                        guild.voiceChannel = message.member.voice.channel;
                        client.getID(args.slice(1).join(' '), async function (id, playlist, name, done = false) {
                            const videoInfo = await client.youtube.getVideoByID(id);
                            if (!playlist) {
                                let hours = Math.floor(videoInfo.durationSeconds / 60 / 60);
                                let minutes = Math.floor(videoInfo.durationSeconds / 60 % 60).toString().length === 2 ? Math.floor(videoInfo.durationSeconds / 60 % 60) : "0" + Math.floor(videoInfo.durationSeconds / 60 % 60).toString();
                                let seconds = Math.floor(videoInfo.durationSeconds % 60).toString().length === 2 ? Math.floor(videoInfo.durationSeconds % 60) : "0" + Math.floor(videoInfo.durationSeconds % 60);
                                let embed = new Discord.MessageEmbed()
                                    .setDescription(`Added to Queue: **[${videoInfo.title}](${videoInfo.url})**`)
                                    .setThumbnail(videoInfo.thumbnails['high'].url)
                                    .setFooter(`${hours}:${minutes}:${seconds} | Published at`)
                                    .setTimestamp(videoInfo.publishedAt)
                                    .setColor(0x00FFFF);
                                //message.reply(` Added to Queue: **${videoInfo.title}**`);
                                if (!message.member.voice.channel) return client.editMsg(sMessage, "You have to be in a voice channel!", message);
                                client.add_to_queue(id, message);
                                client.editMsg(sMessage, embed, message);
                                guild.queueNames.push(videoInfo.title);
                            } else {
                                if (!message.member.voice.channel) {
                                    return client.editMsg(sMessage, "You have to be in a voice channel!", message);
                                }
                                guild.queueNames.push(videoInfo.title);
                                if (done)
                                    client.editMsg(sMessage, `Added a playlist to the queue: **${name}**`, message);
                            }
                        }, message);
                    }

                    if (message.member.voice.channel) {
                        if (!args[1]) return client.editMsg(sMessage, "You have to supply a title or a link for me to play!", message);
                        if (client.mBool[message.guild.id]) return client.editMsg(sMessage, "Please wait for other people to finish searching.", message);
                        if (guild.queue.length > 0 || guild.isPlaying) {
                            if (message.member.voice.channel != message.guild.me.voice.channel) return client.editMsg(sMessage, "You have to be in the same voice channel as me to use that command!", message);
                            second();
                        } else {
                            if (!message.member.voice.channel.permissionsFor(message.guild.me).has("CONNECT")) return client.editMsg(sMessage, "I do not have enough permissions to connect!", message);
                            first();
                        }
                    } else {
                        client.editMsg(sMessage, `${message.author}, You have to be in a voice channel to use this!`, message);
                    }
                }

                if (bool) {
                    args = message.content.slice(PREFIX.length).split(' ');
                    for (let i = args.length - 1; i--;)
                    if (args[i] == '')
                        args.splice(i, 1);
                    let msgToEdit;
                    try {
                        msgToEdit = await message.channel.messages.fetch(client.msgEdit[message.id]);
                    } catch (e) {
                        msgToEdit = null;
                    }
                    playcmd(msgToEdit);
                } else {
                    playcmd(message);
                }
            } catch (e) {
                message.channel.send(`Something went wrong while executing the command: \`${PREFIX}play\`\n\n\`\`\`xl\n${e}\n\`\`\``);
                console.error(e);
            }
        },
        jyguyOnly: 0,
        category: "fun"
}