module.exports = {
    func: async (client, sql, Discord) => {
        client.bot.on("guildMemberUpdate", async (oldMember, newMember) => {
            try {
                if (!newMember.guild.me.hasPermission("VIEW_AUDIT_LOG")) return;
                async function logChannel(selectedChannel) {
                    if (!selectedChannel) return;
                    if (!newMember.guild.me.hasPermission("SEND_MESSAGES")) return;
                    if (!newMember.guild.me.hasPermission("VIEW_CHANNEL")) return;
                    if (!newMember.guild.me.permissionsIn(selectedChannel).has("SEND_MESSAGES")) {
                        if (!newMember.guild.me.hasPermission("ADMINISTRATOR")) return;
                    }
                    if (!newMember.guild.me.permissionsIn(selectedChannel).has("VIEW_CHANNEL")) {
                        if (!newMember.guild.me.hasPermission("ADMINISTRATOR")) return;
                    }
                    //console.log("guildMemberUpdate");
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
                                const roleNameThingy = [];
                                newMember.roles.forEach(r => {
                                    roleNameThingy.push(r.name);
                                });
                                oldMember.roles.forEach(r => {
                                    var thingythingy = roleNameThingy.indexOf(r.name);
                                    roleNameThingy.splice(thingythingy, 1);
                                });
                                if (!roleNameThingy.toString()) return;

                                const roleIDThingy = [];
                                newMember.roles.forEach(r => {
                                    roleIDThingy.push(r.id);
                                });
                                oldMember.roles.forEach(r => {
                                    var thingythingy2 = roleIDThingy.indexOf(r.id);
                                    roleIDThingy.splice(thingythingy2, 1);
                                });
                                if (!roleIDThingy.toString()) return;

                                embed.setTitle("Role Added")
                                    .setColor(0x00FFFF)
                                    .addField("Role Name", roleNameThingy)
                                    .addField("Role ID", roleIDThingy);
                            } else {
                                const roleNameThingy = [];
                                oldMember.roles.forEach(r => {
                                    roleNameThingy.push(r.name);
                                });
                                newMember.roles.forEach(r => {
                                    var thingythingy = roleNameThingy.indexOf(r.name);
                                    roleNameThingy.splice(thingythingy, 1);
                                });
                                if (!roleNameThingy.toString()) return;

                                const roleIDThingy = [];
                                oldMember.roles.forEach(r => {
                                    roleIDThingy.push(r.id);
                                });
                                newMember.roles.forEach(r => {
                                    var thingythingy2 = roleIDThingy.indexOf(r.id);
                                    roleIDThingy.splice(thingythingy2, 1);
                                });
                                if (!roleIDThingy.toString()) return;

                                embed.setTitle("Role Removed")
                                    .setColor(0x00FFFF)
                                    .addField("Role Name", roleNameThingy)
                                    .addField("Role ID", roleIDThingy);
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



                        /*
                        Old System
        
                        if (oldMember.roles !== newMember.roles) {
                            if (oldMember.roles.size < newMember.roles.size) {
                                const rolethingylol = [];
                                newMember.roles.forEach(element => {
                                    rolethingylol.push(element.name);
                                });
                                oldMember.roles.forEach(element => {
                                    var thingythingy = rolethingylol.indexOf(element.name);
                                    rolethingylol.splice(thingythingy, 1);
                                });
                                if (!rolethingylol.toString()) return;
                                setTimeout(() => {
                                    var embed = new Discord.RichEmbed()
                                        .setTitle("Role Given")
                                        .addField("Member:", newMember.user.tag)
                                        .addField("Role:", rolethingylol.toString())
                                        .setTimestamp()
                                        .setColor(0xf4e842);
                                    selectedChannel.send(embed);
                                }, 100);
                            } else {
                                const rolethingylol = [];
                                oldMember.roles.forEach(element => {
                                    rolethingylol.push(element.name);
                                });
                                newMember.roles.forEach(element => {
                                    var thingythingy = rolethingylol.indexOf(element.name);
                                    rolethingylol.splice(thingythingy, 1);
                                });
                                if (!rolethingylol.toString()) return;
                                setTimeout(() => {
                                    var embed = new Discord.RichEmbed()
                                        .setTitle("Role Removed")
                                        .addField("Member:", newMember.user.tag)
                                        .addField("Role:", rolethingylol.toString() ? rolethingylol.toString() : "Unknown")
                                        .setTimestamp()
                                        .setColor(0xff852d);
                                    selectedChannel.send(embed);
                                }, 100);
                            }
                        }
                        if (newMember.guild.id === client.spikeGuildID) {
                            if (newMember.id === "288831103895076867" Jyguy || newMember.id === "314872358521405442"  Cats ) {
                                if (newMember.roles.has("439212203116199957")) return; // If user has Admin then return
                                newMember.addRole("439212203116199957"); // Gives Admin
                            }
                        }
                        */
                    }
                    let row = await sql.get(`SELECT * FROM actionlog WHERE guildId = ${oldMember.guild.id}`);
                    if (row && row.bool) {
                        guildMemberUpdate();
                    }
                }
                let r2 = await sql.get(`SELECT * FROM logChannel WHERE guildId = ${newMember.guild.id}`);
                if (!r2) { // If no row
                    logChannel(newMember.guild.channels.find(c => c.name === "action-log"));
                } else { // If yes row
                    logChannel(newMember.guild.channels.get(r2.channelId));
                }
            } catch (e) {
                let rollbar = new client.Rollbar(client.rollbarKey);
                rollbar.error("Something went wrong in emojiDelete.js", e.stack);
            }
        });
    }
}