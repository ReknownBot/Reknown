module.exports = {
    func: async (client, sql, Discord) => {
        client.bot.on("guildMemberUpdate", async (oldMember, newMember) => {
            try {
                if (!newMember.guild.me.hasPermission("VIEW_AUDIT_LOG")) return;
                async function logChannel(selectedChannel) {
                    if (!selectedChannel) return;
                    if (!newMember.guild.me.permissionsIn(selectedChannel).has("SEND_MESSAGES") && !newMember.guild.me.hasPermission("ADMINISTRATOR")) return;
                    if (!newMember.guild.me.permissionsIn(selectedChannel).has("VIEW_CHANNEL") && !newMember.guild.me.hasPermission("ADMINISTRATOR")) return;
                    async function guildMemberUpdate() {
                        if (oldMember.roles.size !== newMember.roles.size) { // If there was a role change
                            let audit = await newMember.guild.fetchAuditLogs({
                                limit: 1,
                                type: 25
                            });
                            let info = audit.entries.first();
                            let embed = new Discord.MessageEmbed()
                                .setAuthor(info.executor.tag, info.executor.displayAvatarURL())
                                .addField("Time", info.createdAt)
                                .addField("Reason", info.reason ? info.reason : "None")
                                .addField("Member", newMember.user.tag + ` (${newMember.id})`)
                                .setThumbnail(newMember.user.displayAvatarURL())
                                .setFooter(`Log ID: ${info.id}`);

                            if (oldMember.roles.size < newMember.roles.size) { // If a role(s) has been added
                                const roles = newMember.roles.filter(r => !oldMember.roles.has(r.id));

                                embed.setTitle("Role Added")
                                    .setColor(0x00FF00)
                                    .addField("Role Name", roles.map(r => r.name).list())
                                    .addField("Role ID", roles.map(r => r.id).list());
                            } else { // If a role(s) has been removed
                                const roles = oldMember.roles.filter(r => !newMember.roles.has(r.id));

                                embed.setTitle("Role Removed")
                                    .setColor(0xFF0000)
                                    .addField("Role Name", roles.map(r => r.name).list())
                                    .addField("Role ID", roles.map(r => r.id).list());
                            }

                            selectedChannel.send(embed);
                        } else { // If there was no role change
                            let audit = await newMember.guild.fetchAuditLogs({
                                limit: 1,
                                type: 24
                            });
                            let info = audit.entries.first();
                            let embed = new Discord.MessageEmbed()
                                .setAuthor(info.executor.tag, info.executor.displayAvatarURL())
                                .addField("Time", info.createdAt)
                                .addField("Reason", info.reason ? info.reason : "None")
                                .addField("Member", newMember.user.tag + ` (${newMember.user.id})`)
                                .setThumbnail(newMember.user.displayAvatarURL())
                                .setFooter(`ID: ${info.id}`);

                            if (info.changes[0].key === "nick") { // If there was a nickname change
                                let oldNickname = info.changes[0].old;
                                let newNickname = info.changes[0].new;
                                embed.addField("Old Nickname", oldNickname ? oldNickname : "None")
                                    .setColor(0x00FFFF)
                                    .setTitle("Nickname Changed")
                                    .addField("New Nickname", newNickname ? newNickname : `Nickname Reset (${info.target.username})`);
                            } else if (info.changes[0].key === "mute") { // If the member was muted in ANY WAY
                                embed.setTitle("Member Muted")
                                    .setColor(0xffa500); // Orange
                            }

                            selectedChannel.send(embed);
                        }
                    }
                    let row = (await sql.query('SELECT * FROM actionlog WHERE guildId = $1', [oldMember.guild.id])).rows[0];
                    if (row && row.bool) {
                        guildMemberUpdate();
                    }
                }
                let r2 = (await sql.query('SELECT * FROM logChannel WHERE guildId = $1', [newMember.guild.id])).rows[0];
                if (!r2) { // If no row
                    logChannel(newMember.guild.channels.find(c => c.name === "action-log"));
                } else { // If yes row
                    logChannel(newMember.guild.channels.get(r2.channelid));
                }
            } catch (e) {
                let rollbar = new client.Rollbar(client.rollbarKey);
                rollbar.error("Something went wrong in emojiDelete.js", e);
                console.log(e);
            }
        });
    }
}