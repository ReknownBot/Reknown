async function kicked(member, info, channel, Discord) {
    const embed = new Discord.MessageEmbed()
        .setTitle('Member Kicked')
        .setColor(0xffa500)
        .setAuthor(info.executor.tag, info.executor.displayAvatarURL())
        .setTimestamp()
        .addField('Member', `${member.user.tag} (${member.id})`)
        .addField('Reason', info.reason ? info.reason : 'None');

    channel.send(embed);
}

module.exports = {
    func: async (client, sql, Discord) => {
        client.bot.on("guildMemberRemove", async member => {
            try {
                if (!member.guild) return;
                // If it's the bot that was kicked / left
                if (member.user === client.bot.user) return;

                if (!member.guild.me)
                    member.guild.me = await member.guild.members.fetch({
                        user: client.bot.user,
                        cache: true
                    });

                // Checks if the guild has welcome messages enabled
                let r3 = (await sql.query('SELECT * FROM toggleWelcome WHERE guildId = $1', [member.guild.id])).rows[0];
                if (r3 && r3.bool) {
                    // Gets the goodbye channel for the guild
                    let r = await (sql.query('SELECT * FROM welcomeChannel WHERE guildId = $1', [member.guild.id])).rows[0];
                    // This is for the goodbye channel
                    async function goodbyeChannel(goodbyeChannel) {
                        // If the channel exists
                        if (goodbyeChannel) {
                            // If the bot does not have send messages perms in the welcome channel & does not have administrator (bypass all overwrites) then return
                            if (!member.guild.me.permissionsIn(goodbyeChannel).has("SEND_MESSAGES") && !member.guild.me.hasPermission("ADMINISTRATOR")) return;
                            if (!member.guild.me.permissionsIn(goodbyeChannel).has("VIEW_CHANNEL") && !member.guild.me.hasPermission("ADMINISTRATOR")) return;

                            // Function for goodbye messages
                            function goodbyeMessages(msg) {
                                // Creates an embed
                                let embed = new Discord.MessageEmbed()
                                    .setColor(0xffaa00)
                                    .setDescription(msg)
                                    .setThumbnail(member.user.displayAvatarURL());
                                // Sends the embed to the goodbye channel
                                goodbyeChannel.send(embed);
                            }

                            // Gets the goodbye message for the guild
                            let r2 = (await sql.query('SELECT * FROM goodbyeMessages WHERE guildId = $1', [member.guild.id])).rows[0];
                            if (!r2) { // If the row is not found (i.e no custom goodbye message)
                                goodbyeMessages(`${member} has left **${member.guild.name}**.\n\n*There are *${member.guild.memberCount}* members left.*`);
                            } else { // Vise versa
                                // If the custom message is invalid for some reason, use the default instead
                                let customMessage = r2.custommessage.replace("<User>", member.toString()).replace("<Guild>", member.guild.name).replace("<MemberCount>", member.guild.memberCount) || `${member} has left **${member.guild.name}**.\n\n*There are *${member.guild.memberCount}* members left.*`;
                                goodbyeMessages(customMessage);
                            }
                        }
                    }
                    // If it is default
                    if (!r || !r.channel)
                        goodbyeChannel(member.guild.channels.find(c => c.position === 0 && c.type === 'text'));
                    else // If it's custom
                        goodbyeChannel(member.guild.channels.get(r.channel));
                }

                // Checks if the guild has action log enabled
                let r = (await sql.query('SELECT * FROM actionlog WHERE guildId = $1', [member.guild.id])).rows[0];
                if (r && r.bool) { // If they have it enabled
                    let info;
                    if (member.guild.me.hasPermission("VIEW_AUDIT_LOG")) {
                        let audit = await member.guild.fetchAuditLogs({
                            limit: 1
                        });
                        info = audit.entries.first();
                    }
                    // Creates an embed
                    let embed = new Discord.MessageEmbed()
                        .setColor(0xffaa00)
                        .setThumbnail(member.user.displayAvatarURL())
                        .setTimestamp()
                        .setDescription(`**Member:** ${member.user.tag} :: ${member.id}`)
                        .setTitle("Member Left");
                    // Looks for the log channel selected
                    let r2 = (await sql.query('SELECT * FROM logChannel WHERE guildId = $1', [member.guild.id])).rows[0];
                    if (!r2 || !r2.channelid) { // If it is default
                        let selectedChannel = member.guild.channels.find(c => c.name === "action-log");
                        if (selectedChannel) {
                            if (!member.guild.me.permissionsIn(selectedChannel).has("SEND_MESSAGES") && !member.guild.me.hasPermission("ADMINISTRATOR")) return;
                            if (!member.guild.me.permissionsIn(selectedChannel).has("VIEW_CHANNEL") && !member.guild.me.hasPermission("ADMINISTRATOR")) return;
                            if (!info || info.action !== 'MEMBER_KICK' || info.createdTimestamp > 1000)
                                selectedChannel.send(embed);
                            else if (info.action === 'MEMBER_KICK')
                                kicked(member, info, selectedChannel, Discord);
                        }
                    } else { // If it is custom
                        let selectedChannel = member.guild.channels.get(r2.channelid);
                        if (selectedChannel) {
                            if (!member.guild.me.permissionsIn(selectedChannel).has("SEND_MESSAGES") && !member.guild.me.hasPermission("ADMINISTRATOR")) return;
                            if (!member.guild.me.permissionsIn(selectedChannel).has("VIEW_CHANNEL") && !member.guild.me.hasPermission("ADMINISTRATOR")) return;
                            if (!info || info.action !== 'MEMBER_KICK' || info.createdTimestamp > 1000)
                                selectedChannel.send(embed);
                            else if (info.action === 'MEMBER_KICK')
                                kicked(member, info, selectedChannel, Discord);
                        }
                    }
                }
            } catch (e) {
                let rollbar = new client.Rollbar(client.rollbarKey);
                rollbar.error("Something went wrong in guildMemberRemove.js", e);
                console.error(e);
            }
        });
    }
}
