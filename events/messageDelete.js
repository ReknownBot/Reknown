module.exports = {
    func: (client, sql, Discord) => {
        client.bot.on("messageDelete", async message => {
            try {
                // If the message was sent in not a guild channel
                if (message.channel.type !== "text") return;

                let row2 = (await sql.query('SELECT * FROM star WHERE msgID = $1', [message.id])).rows[0];
                let row3 = (await sql.query('SELECT * FROM togglestar WHERE guildId = $1', [message.guild.id])).rows[0];
                let row4 = (await sql.query('SELECT * FROM starchannel WHERE guildId = $1', [message.guild.id])).rows[0];
                let sChannel;
                if (row4)
                    sChannel = message.guild.channels.get(row4.channelId);
                else
                    sChannel = message.guild.channels.find(c => c.name === "starboard");
                if (row2 && (!row3 || row3.bool)) {
                    sql.query('DELETE FROM star WHERE msgID = $1', [message.id]);
                    if (sChannel) {
                        let msg = await sChannel.messages.fetch(row2.editID);
                        msg ? msg.delete() : null;
                    }
                }

                if (message.author === client.bot.user) return; // If it's Reknown, my bot
                async function logChannel(selectedChannel) {
                    if (!selectedChannel) return;
                    if (!message.guild.me.permissionsIn(selectedChannel).has("SEND_MESSAGES") && !message.guild.me.hasPermission("ADMINISTRATOR")) return;
                    if (!message.guild.me.permissionsIn(selectedChannel).has("VIEW_CHANNEL") && !message.guild.me.hasPermission("ADMINISTRATOR")) return;
                    async function messageDelete() {
                        let embed;
                        if (message.content.length > 1024) {
                            embed = new Discord.MessageEmbed()
                                .setTitle("Message Over 1024 characters Deleted")
                                .addField("Author", message.author.tag)
                                .addField("Channel", message.channel.toString())
                                .setColor(0xFF0000);
                        } else {
                            if (message.embeds.find(e => e.type === 'rich')) {
                                embed = new Discord.MessageEmbed(message.embeds[0]);
                                message.embeds[0].image ? embed.setImage(message.embeds[0].image.proxyURL) : null;
                                message.embeds[0].thumbnail ? embed.setThumbnail(message.embeds[0].thumbnail.proxyURL) : null;
                                selectedChannel.send(`${message.author.tag}'s (${message.author.id}) Embed Deleted at ${message.channel.toString()}:`, {
                                    embed
                                });
                            } else {
                                embed = new Discord.MessageEmbed()
                                    .setTitle("Message Deleted")
                                    .addField("Content:", message.content ? message.content : "None")
                                    .addField("Author:", message.author.tag)
                                    .addField("Channel", message.channel.toString())
                                    .setColor(0xFF0000);
                                if (message.attachments.size > 0 && message.attachments.first().width) {
                                    embed.setImage(message.attachments.first().proxyURL);
                                }
                                selectedChannel.send(embed);
                            }
                        }
                    }
                    let row = (await sql.query('SELECT * FROM actionlog WHERE guildId = $1', [message.guild.id])).rows[0];
                    if (row && row.bool) {
                        messageDelete();
                    }
                }

                let r2 = (await sql.query('SELECT * FROM logChannel WHERE guildId = $1', [message.guild.id])).rows[0];
                if (!r2) {
                    logChannel(message.guild.channels.find(c => c.name === "action-log"));
                } else {
                    logChannel(message.guild.channels.get(r2.channelid));
                }
            } catch (e) {
                let rollbar = new client.Rollbar(client.rollbarKey);
                rollbar.error("Something went wrong in messageDelete.js", e);
                console.error(e);
            }
        });
    }
}
