module.exports = {
    func: async (client, sql, Discord) => {
        client.bot.on("messageUpdate", async (oldMessage, newMessage) => {
            try {
                if (newMessage.channel.type !== "text") return;

                async function logChannel(selectedChannel) {
                    async function messageUpdate() {
                        if (!selectedChannel) return;
                        if (!newMessage.guild.me.permissionsIn(selectedChannel).has("SEND_MESSAGES")) {
                            if (!newMessage.guild.me.hasPermission("ADMINISTRATOR")) return;
                        }
                        if (!newMessage.guild.me.permissionsIn(selectedChannel).has("VIEW_CHANNEL")) {
                            if (!newMessage.guild.me.hasPermission("ADMINISTRATOR")) return;
                        }
                        //console.log('messageUpdate');
                        if (oldMessage.content === newMessage.content) return;
                        let embed = new Discord.MessageEmbed()
                            .setTitle("Message Edited")
                            .addField("Previous Content:", oldMessage.content ? (oldMessage.content.length > 1024 ? "Over 1024 Characters" : oldMessage.content) : "None")
                            .addField("After:", newMessage.content ? (newMessage.content.length > 1024 ? "Over 1024 Characters" : newMessage.content) : "None")
                            .addField("Author:", oldMessage.author.tag)
                            .setColor(0x00FFFF)
                            .setThumbnail(oldMessage.author.displayAvatarURL());
                        selectedChannel.send("", {
                            embed: embed
                        });
                    }
                    let row = (await sql.query('SELECT * FROM actionlog WHERE guildId = $1', [oldMessage.guild.id])).rows[0];
                    if (row && row.bool) {
                        messageUpdate();
                    }
                }

                let r2 = (await sql.query('SELECT * FROM logChannel WHERE guildId = $1', [newMessage.guild.id])).rows[0];
                if (!r2) {
                    logChannel(newMessage.guild.channels.find(c => c.name === "action-log"));
                } else {
                    logChannel(newMessage.guild.channels.get(r2.channelId));
                }

                // Starboard Content Update
                if (newMessage.content || newMessage.attachments.size > 0) {
                    let row2 = (await sql.query('SELECT * FROM togglestar WHERE guildId = $1', [newMessage.guild.id])).rows[0];
                    let row3 = (await sql.query('SELECT * FROM starchannel WHERE guildId = $1', [newMessage.guild.id])).rows[0];
                    let row4 = (await sql.query('SELECT * FROM star WHERE msgID = $1', [newMessage.id])).rows[0];
                    if ((row2 && row2.bool) && row4) {
                        let sChannel;
                        if (!row3)
                            sChannel = newMessage.guild.channels.find(c => c.name === "starboard" && c.type === "text");
                        else
                            sChannel = newMessage.guild.channels.get(row3.channelId);
                        if (sChannel) {
                            let msg2 = await sChannel.messages.fetch(row4.editID);
                            if (msg2) {
                                let embed = new Discord.MessageEmbed(msg2.embeds[0]);
                                embed.fields = [{
                                        name: "Author",
                                        value: newMessage.author.toString(),
                                        inline: true
                                    },
                                    {
                                        name: "Channel",
                                        value: newMessage.channel.toString(),
                                        inline: true
                                    }
                                ];
                                newMessage.content ? (embed.fields[2] ? embed.addField("Message", newMessage.content) : embed.fields[2] = {
                                    name: "Message",
                                    value: newMessage.content
                                }) : embed.fields[2] = {};
                                let img = newMessage.attachments.find(attch => attch.height);
                                img ? embed.setImage(img.proxyURL) : null;
                                msg2.edit(embed);
                            } else
                                // Deletes the row if the message doesn't exist
                                sql.query('DELETE FROM star WHERE msgID = $1', [newMessage.id]);
                        }
                    }
                }

                // Command Update
                if (!newMessage.channel.permissionsFor(client.bot.user).has("VIEW_CHANNEL") || !newMessage.channel.permissionsFor(client.bot.user).has("SEND_MESSAGES")) return;
                let prefixRow = (await sql.query('SELECT * FROM prefix WHERE guildId = $1', [newMessage.guild.id])).rows[0];
                let prefix;
                if (!prefixRow)
                    prefix = "?";
                else
                    prefix = prefixRow.customprefix;
                let regexp = new RegExp(`^<@!?${client.bot.user.id}> `);
                prefix = newMessage.content.match(regexp) ? newMessage.content.match(regexp)[0] : (prefixRow ? prefixRow.customprefix : "?");
                let args = newMessage.content.slice(prefix.length).split(' ');
                for (let i = args.length - 1; i--;)
                    if (args[i] == '')
                        args.splice(i, 1);
                let msgToEdit;
                try {
                    msgToEdit = await newMessage.channel.messages.fetch(client.msgEdit[newMessage.id]);
                } catch (e) {
                    msgToEdit = null;
                }
                if (newMessage.content.startsWith(prefix) && newMessage.content !== prefix && oldMessage.content !== newMessage.content) {
                    async function commandThingy() {
                        let unknownCommand = `Invalid command. Use ${prefix}help to see the commands!`; // Defines unknownCommand so jyguy doesn't need to type it all the time
                        if (args[0].toLowerCase() in client.commands) { // if there is the command in the command list
                            if (client.cooldown.has(newMessage.author.id))
                                client.commands[args[0].toLowerCase()].func(client, newMessage, args, unknownCommand, newMessage.content.toLowerCase(), sql, Discord, require("fs"), prefix, true); // executes the function of the command (code in separate files in folder commands)
                        } else {
                            let row = (await sql.query('SELECT * FROM cmdnotfound WHERE guildId = $1', [newMessage.guild.id])).rows[0];
                            if (row && !row.bool) return;
                            let arr = [];
                            client.commandsList.forEach(command => {
                                let rawcommand = command.slice(0, command.length - 3);
                                let item = client.commands[rawcommand];
                                // If the message author ID is Jyguy, add it to the list regardless of guilds
                                if (newMessage.author.id === '288831103895076867') {
                                    arr.push(`${rawcommand} ${client.fuzz.ratio(rawcommand, args[0])}`);
                                    // From now on the member will be 100% not jyguy
                                } else if (!item.jyguyOnly)
                                    arr.push(`${rawcommand} ${client.fuzz.ratio(rawcommand, args[0])}`);
                            });
                            let arr2 = arr.sort((a, b) => {
                                return b.split(' ')[1] - a.split(' ')[1];
                            });
                            let content = `Could not find the command. Did you mean \`${arr2[0].split(' ')[0]}, ${arr2[1].split(' ')[0]}, or ${arr2[2].split(' ')[0]}\`?`;
                            if (msgToEdit) {
                                if (msgToEdit.edit) {
                                    msgToEdit.edit(content, {
                                        embed: null
                                    });
                                } else {
                                    let msg = await newMessage.channel.send(content);
                                    client.msgEdit[newMessage.id] = msg.id;
                                }
                            } else {
                                let msg = await newMessage.channel.send(content);
                                client.msgEdit[newMessage.id] = msg.id;
                            }
                        }
                    }

                    let r1 = (await sql.query('SELECT * FROM blacklist WHERE userId = $1', [newMessage.author.id])).rows[0];
                    if (r1) {
                        let row2 = (await sql.query('SELECT * FROM blacklistmsg WHERE guildId = $1', [newMessage.guild.id])).rows[0];
                        if (!row2 || row2.bool) {
                            if (msgToEdit) {
                                msgToEdit.edit(`You are blacklisted from me by: \`${r1.by}\` and reason: \`${r1.reason}\``);
                            } else {
                                msg = await newMessage.channel.send(`You are blacklisted from me by: \`${r1.by}\` and reason: \`${r1.reason}\``);
                                client.msgEdit[newMessage.id] = msg.id;
                            }
                        }
                    } else {
                        let r2 = (await sql.query('SELECT * FROM cooldownmsg WHERE guildId = $1', [newMessage.guild.id])).rows[0];
                        if (client.cooldown.has(newMessage.author.id)) {
                            if (!r2 || r2.bool) {
                                if (msgToEdit) {
                                    msgToEdit.edit("Please wait 3 seconds before executing a command.");
                                } else {
                                    msg = await newMessage.channel.send("Please wait 3 seconds before executing a command.");
                                    client.msgEdit[newMessage.id] = msg.id;
                                }
                            }
                        } else {
                            client.cooldown.add(newMessage.author.id); // Adds the ID to the set
                            setTimeout(() => {
                                client.cooldown.delete(newMessage.author.id); // Deletes the ID after 3 seconds
                            }, 3000);
                            commandThingy();
                        }
                    }
                }
            } catch (e) {
                let rollbar = new client.Rollbar(client.rollbarKey);
                rollbar.error("Something went wrong in messageUpdate.js", e);
                console.log(e);
            }
        });
    }
}
