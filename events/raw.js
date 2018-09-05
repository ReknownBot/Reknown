const events = {
    MESSAGE_REACTION_ADD: "messageReactionAdd",
    MESSAGE_REACTION_REMOVE: "messageReactionRemove",
    MESSAGE_REACTION_REMOVE_ALL: "messageReactionRemoveAll"
}

module.exports = {
    func: async (client, sql, Discord) => {
        client.bot.on("raw", async event => {
            if (!events.hasOwnProperty(event.t)) return;
            const {
                d: data
            } = event;
            if (event.t === "MESSAGE_REACTION_ADD" || event.t === "MESSAGE_REACTION_REMOVE") {
                const channel = client.bot.channels.get(data.channel_id);
                if (!channel.permissionsFor(client.bot.user).has("VIEW_CHANNEL")) return;
                let message;
                try {
                    message = await channel.messages.fetch(data.message_id);
                } catch (e) {
                    if (!e.toString().includes("DiscordAPIError: Unknown Message"))
                        throw new Error(e);
                    else return;
                }
                if (!message.content && message.attachments.size === 0 && message.embeds[0]) return;
                const {
                    emoji
                } = data;
                if (channel.type !== "text") return; // If DM or Group
                if (emoji.name !== "⭐") return; // If not a star
                let member = message.guild.members.get(data.user_id);
                if (!member)
                    member = await message.guild.members.fetch({ user: data.user_id, cache: true });
                const row = (await sql.query('SELECT * FROM togglestar WHERE guildId = $1', [message.guild.id])).rows[0];
                const row2 = (await sql.query('SELECT * FROM starchannel WHERE guildId = $1', [message.guild.id])).rows[0];
                const row3 = (await sql.query('SELECT * FROM star WHERE msgID = $1', [message.id])).rows[0];
                // Enabled
                if (row && row.bool) {
                    const sChannel = message.guild.channels.get(row2 ? row2.channelid : null) || message.guild.channels.find(c => c.name === "starboard");
                    if (!sChannel) return;
                    // Perm Checks
                    if (!sChannel.permissionsFor(client.bot.user).has("VIEW_CHANNEL") || !sChannel.permissionsFor(client.bot.user).has("SEND_MESSAGES") || !sChannel.permissionsFor(client.bot.user).has("EMBED_LINKS")) return;
                    if (member.id === message.author.id) return channel.send(`${member}, You cannot star your own messages.`)
                    .then(m => m.delete({
                        timeout: 5000
                    }))
                    .catch(e => {
                        if (e != "DiscordAPIError: Missing Permissions") {
                            console.log(e);
                        }
                    });
                    let embed = new Discord.MessageEmbed()
                        .addField("Author", message.author.toString(), true)
                        .addField("Channel", channel.toString(), true)
                        .setColor(0xffd000)
                        .setTimestamp();
                    message.content ? embed.addField("Message", message.content) : null;
                    let img = message.attachments.find(attch => attch.height);
                    img ? embed.setImage(img.proxyURL) : null;
                    let reactionCount = message.reactions.get("⭐") ? message.reactions.get("⭐").count : 0;
                    embed.setFooter(`⭐${reactionCount} | ID: ${message.id}`);
                    if (!row3) {
                        let msg = await sChannel.send(embed);
                        sql.query("INSERT INTO star (msgID, editID) VALUES ($1, $2)", [message.id, msg.id]);
                    } else {
                        let sMessage;
                        try {
                            sMessage = await sChannel.messages.fetch(row3.editid);
                        } catch (e) {
                            sMessage = null;
                        }
                        if (sMessage) {
                            if (reactionCount === 0) {
                                sMessage.delete();
                            } else {
                                sMessage.edit(embed);
                            }
                        } else {
                            if (reactionCount !== 0) {
                                let msg = await sChannel.send(embed);
                                sql.query("UPDATE star SET editID = $1", [msg.id]);
                            }
                        }
                    }
                }
            } else if (event.t === "MESSAGE_REACTION_REMOVE_ALL") {
                // Gets the Channel by ID
                const channel = client.bot.channels.get(data.channel_id);
                if (!channel.permissionsFor(client.bot.user).has("VIEW_CHANNEL")) return;
                // Fetches the message
                const message = await channel.messages.fetch(data.message_id);
                // Gets the guild by ID
                const guild = client.bot.guilds.get(data.guild_id);
                if (channel.type !== "text") return; // If DM or Group
                const row = (await sql.query('SELECT * FROM togglestar WHERE guildId = $1', [guild.id])).rows[0];
                const row2 = (await sql.query('SELECT * FROM starchannel WHERE guildId = $1', [guild.id])).rows[0];
                const row3 = (await sql.query('SELECT * FROM star WHERE msgID = $1', [message.id])).rows[0];
                // Enabled
                if ((row && row.bool) && row3) {
                    const sChannel = guild.channels.get(row2 ? row2.channelId : null) || guild.channels.find(c => c.name === "starboard");
                    sql.query('DELETE FROM star WHERE msgID = $1', [message.id]);
                    if (!sChannel) return;
                    // Perm Check (Deleting own message only takes read messages)
                    if (!sChannel.permissionsFor(client.bot.user).has("VIEW_CHANNEL")) return;
                    let sMessage = await sChannel.messages.fetch(row3.editid);
                    if (!sMessage.deleted)
                        sMessage.delete();
                }
            }
        });
    }
}
