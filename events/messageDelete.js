module.exports = {
    func: (client, sql, Discord) => {
        client.bot.on("messageDelete", async message => {
            try {
                // If the message was sent in not a guild channel
                if (message.channel.type !== "text") return;

                let row2 = await sql.get(`SELECT * FROM star WHERE msgID = ${message.id}`);
                let row3 = await sql.get(`SELECT * FROM togglestar WHERE guildId = ${message.guild.id}`);
                let row4 = await sql.get(`SELECT * FROM starchannel WHERE guildId = ${message.guild.id}`);
                let sChannel;
                if (row4)
                    sChannel = message.guild.channels.get(row4.channelId);
                else
                    sChannel = message.guild.channels.find(c => c.name === "starboard");
                if (row2 && (!row3 || row3.bool)) {
                    sql.run(`DELETE FROM star WHERE msgID = ${message.id}`);
                    if (sChannel) {
                        let msg = await sChannel.messages.fetch(row2.editID);
                        msg ? msg.delete() : null;
                    }
                }

                if (message.author === client.bot.user) return; // If it's Reknown, my bot
                async function logChannel(selectedChannel) {
                    if (!selectedChannel) return;
                    if (!message.guild.me.hasPermission("SEND_MESSAGES")) return;
                    if (!message.guild.me.hasPermission("VIEW_CHANNEL")) return;
                    if (!message.guild.me.permissionsIn(selectedChannel).has("SEND_MESSAGES")) {
                        if (!message.guild.me.hasPermission("ADMINISTRATOR")) return;
                    }
                    if (!message.guild.me.permissionsIn(selectedChannel).has("VIEW_CHANNEL")) {
                        if (!message.guild.me.hasPermission("ADMINISTRATOR")) return;
                    }
                    //console.log('messageDelete');
                    async function messageDelete() {
                        /* WIP
                        setTimeout(() => {
                            message.guild.fetchAuditLogs({
                                limit: 1,
                                type: 72
                            }).then(audit => {
                                let info = audit.entries.first();
                                if (info.executor.bot) return;
                                let embed = new Discord.RichEmbed()
                                    .setAuthor(info.executor.tag, info.executor.displayAvatarURL)
                                    .setTitle("Message Deleted")
                                    .addField("Time", info.createdAt)
                                    .addField("Member", message.author.tag + ` (${message.author.id})`)
                                    .addField("Content", message.content ? message.content : "Unknown")
                                    .setColor(0xFF0000)
                                    .setThumbnail(message.author.displayAvatarURL)
                                    .setFooter(`Log ID: ${info.id}`);
        
                                selectedChannel.send(embed);
                            });
                        }, 1000);*/

                        let embed;
                        if (message.content.length > 1024) {
                            embed = new Discord.MessageEmbed()
                                .setTitle("Message Over 1024 characters Deleted")
                                .addField("Author:", message.author.tag)
                                .setColor(0xFF0000);
                        } else {
                            if (message.embeds.find(e => e.type === 'rich')) {
                                embed = new Discord.MessageEmbed(message.embeds[0]);
                                message.embeds[0].image ? embed.setImage(message.embeds[0].image.proxyURL) : null;
                                message.embeds[0].thumbnail ? embed.setThumbnail(message.embeds[0].thumbnail.proxyURL) : null;
                                selectedChannel.send(`${message.author.tag}'s (${message.author.id}) Embed Deleted:`, {
                                    embed
                                });
                            } else {
                                embed = new Discord.MessageEmbed()
                                    .setTitle("Message Deleted")
                                    .addField("Content:", message.content ? message.content : "None")
                                    .addField("Author:", message.author.tag)
                                    .setColor(0xFF0000);
                                if (message.attachments.size > 0 && message.attachments.first().width) {
                                    embed.setImage(message.attachments.first().proxyURL);
                                }
                                selectedChannel.send(embed);
                            }
                        }
                    }
                    let row = await sql.get(`SELECT * FROM actionlog WHERE guildId = ${message.guild.id}`);
                    if (row && row.bool) {
                        messageDelete();
                    }
                }

                let r2 = await sql.get(`SELECT * FROM logChannel WHERE guildId = ${message.guild.id}`);
                if (!r2) {
                    logChannel(message.guild.channels.find(c => c.name === "action-log"));
                } else {
                    logChannel(message.guild.channels.get(r2.channelId));
                }
            } catch (e) {
                let rollbar = new client.Rollbar(client.rollbarKey);
                rollbar.error("Something went wrong in messageDelete.js", e.stack);
                console.error;
            }
        });
    }
}