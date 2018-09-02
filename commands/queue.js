module.exports = {
    help: "This command displays the list of songs that are queued! (For clear, requires music.clear) `Usage: ?queue <Argument>`",
    func: async (client, message, args, unknownCommand, mess, sql, Discord, fs, PREFIX, bool) => {
            try {
                async function queuecmd(sMessage) {
                    if (client.guilds[message.guild.id].queue.length < 1 || !client.guilds[message.guild.id].isPlaying) return client.editMsg(sMessage, "I am not playing anything!", message);
                    if (!args[1]) return client.editMsg(sMessage, "The available arguments are: `list`, `clear`, and `remove`.", message);
                    if (!message.guild.me.voice.channel) return client.editMsg(sMessage, "You're not in a voice channel!", message);
                    if (message.member.voice.channel !== message.guild.me.voice.channel) return client.editMsg(sMessage, "You're not in the same voice channel as me!", message);
                    if (args[1].toLowerCase() === "list") {
                        let pages = [];
                        let page = 1;

                        let str = '';
                        for (let i = 0; i < client.guilds[message.guild.id].queueNames.length; i++) {
                            if (str.length + client.guilds[message.guild.id].queueNames[i].length + 7 + (i + 1).toString().length > 2048) {
                                pages.push(str);
                                str = '';
                            }
                            str += `**${i + 1}.** ${client.guilds[message.guild.id].queueNames[i] + (i === 0 ? " (Current Song)" : "")}\n`;
                        }
                        setTimeout(async () => {
                            if (str) pages.push(str);

                            let embed = new Discord.MessageEmbed()
                                .setTitle(`Queue`)
                                .setColor(0x00FFFF)
                                .setFooter(`Page ${page} of ${pages.length}`)
                                .setDescription(pages[page - 1]);

                            if (pages.length === 1) {
                                client.editMsg(sMessage, embed, message);
                            } else {
                                let msg = client.editMsg(sMessage, embed, message);
                                await msg.react('◀');
                                await msg.react('▶');

                                let backwardFilter = (reaction, user) => reaction.emoji.name === '◀' && user.id === message.author.id;
                                let forwardFilter = (reaction, user) => reaction.emoji.name === '▶' && user.id === message.author.id;

                                const backwards = msg.createReactionCollector(backwardFilter, {
                                    time: 60000
                                });
                                const forwards = msg.createReactionCollector(forwardFilter, {
                                    time: 60000
                                });

                                backwards.on("collect", () => {
                                    if (page === 1) return message.channel.send("You cannot go before page 1!").then(m => m.delete({
                                        timeout: 5000
                                    }));
                                    page--;
                                    embed.setDescription(pages[page - 1])
                                        .setFooter(`Page ${page} of ${pages.length}`);
                                    msg.edit(embed);
                                });

                                forwards.on('collect', () => {
                                    if (page === pages.length) return message.author.send(`You cannot go beyond page ${pages.length}!`).then(m => m.delete({
                                        timeout: 5000
                                    })).catch(e => {
                                        if (e != 'DiscordAPIError: Cannot send messages to this user') {
                                            let rollbar = new client.Rollbar(client.rollbarKey);
                                            rollbar.error("Something went wrong in queue.js", e);
                                        }
                                    });
                                    page++;
                                    embed.setDescription(pages[page - 1])
                                        .setFooter(`Page ${page} of ${pages.length}`);
                                    msg.edit(embed);
                                });
                                backwards.on('end', () => {
                                    msg ? msg.reactions.forEach(r2 => {
                                        if (r2.users.has(client.bot.user.id))
                                            r2.remove();
                                    }) : null;
                                });
                            }
                        }, 500);
                    } else if (args[1].toLowerCase() === "clear") {
                        // Checks for the custom permission
                        let bool2 = false;
                        let i2 = 0;
                        let prom = new Promise(resolve => {
                            message.member.roles.forEach(async role => {
                                let row = await sql.get('SELECT * FROM permissions WHERE roleID = ? AND pName = ? AND pCategory = ?', [role.id, "clear", "music"]);
                                if ((row && row.bool) || message.member === message.guild.owner)
                                    bool2 = true;
                                i2++;
                                if (i2 === message.member.roles.size)
                                    setTimeout(resolve, 10);
                            });
                        });
                        await prom;
                        if (!bool2) return client.editMsg(sMessage, ":x:, Sorry, but you do not have the `music.clear` permission.", message);
                        client.guilds[message.guild.id].queueNames = [client.guilds[message.guild.id].queueNames[0]];
                        client.editMsg(sMessage, "Successfully cleared the queue.", message);
                    } else if (args[1].toLowerCase() === "remove") {
                        // Checks for the custom permission
                        let bool2 = false;
                        let i2 = 0;
                        let prom = new Promise(resolve => {
                            message.member.roles.forEach(async role => {
                                let row = await sql.get('SELECT * FROM permissions WHERE roleID = ? AND pName = ? AND pCategory = ?', [role.id, "clear", "music"]);
                                if ((row && row.bool) || message.member === message.guild.owner)
                                    bool2 = true;
                                i2++;
                                if (i2 === message.member.roles.size)
                                    setTimeout(resolve, 10);
                            });
                        });
                        await prom;
                        if (!bool2) return client.editMsg(sMessage, ":x:, Sorry, but you do not have the `music.clear` permission.", message);
                        if (!args[2]) return client.editMsg(sMessage, "You have to put an index of what song I should remove!", message);
                        let num = args[2];
                        if (isNaN(num)) return client.editMsg(sMessage, "That is not a number!", message);
                        if (num < 1) return client.editMsg(sMessage, "The number cannot be below 1!", message);
                        if (num == 1) return client.editMsg(sMessage, "You cannot remove the song that is currently playing!", message);
                        let guild = client.guilds[message.guild.id];
                        if (num > guild.queueNames.length) return client.editMsg(sMessage, "That number is not less than the amount of songs that are in the queue!", message);
                        let i = num - 1;
                        guild.queue.splice(i, 1);
                        let name = guild.queueNames.splice(i, 1);
                        client.editMsg(sMessage, `Successfully removed **${name}** from the queue.`, message);
                    } else {
                        client.editMsg(sMessage, "The valid arguments are: `list`, `clear`, and `remove`.", message);
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
                    queuecmd(msgToEdit);
                } else {
                    queuecmd(message);
                }
            } catch (e) {
                message.channel.send(`Something went wrong while executing the command: \`${PREFIX}queue\`\n\n\`\`\`xl\n${e}\n\`\`\``);
                console.error(e);
            }
        },
        jyguyOnly: 0,
        category: "fun"
}