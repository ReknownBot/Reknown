module.exports = {
    func: async (client, sql, Discord) => {
        client.bot.on("roleUpdate", async (oldRole, newRole) => {
            try {
                if (!newRole.guild.me.hasPermission("VIEW_AUDIT_LOG")) return;
                async function logChannel(selectedChannel) {
                    if (!selectedChannel) return;
                    if (!newRole.guild.me.hasPermission("SEND_MESSAGES")) return;
                    if (!newRole.guild.me.hasPermission("VIEW_CHANNEL")) return;
                    if (!newRole.guild.me.permissionsIn(selectedChannel).has("SEND_MESSAGES")) {
                        if (!newRole.guild.me.hasPermission("ADMINISTRATOR")) return;
                    }
                    if (!newRole.guild.me.permissionsIn(selectedChannel).has("VIEW_CHANNEL")) {
                        if (!newRole.guild.me.hasPermission("ADMINISTRATOR")) return;
                    }
                    //console.log('roleUpdate');
                    if (oldRole === newRole || !oldRole || !newRole) return;
                    async function roleUpdate() {
                        let audit = await newRole.guild.fetchAuditLogs({
                            limit: 1,
                            type: 31
                        });
                        let info = audit.entries.first();
                        let embed = new Discord.MessageEmbed()
                            .setTitle("Role Updated")
                            .setAuthor(info.executor.tag, info.executor.displayAvatarURL())
                            .setColor(0x00FFFF)
                            .setFooter(`Log ID: ${info.id}`);
                        info.changes.forEach(e => {
                            if (e.key === 'hoist') { // Hoist Change
                                if (oldRole.hoist !== newRole.hoist)
                                    embed.addField("Role Hoist", `Old Setting: ${oldRole.hoist} New Setting: ${newRole.hoist}`);
                            }
                            if (e.key === 'mentionable') { // Ping Change
                                if (oldRole.mentionable !== newRole.mentionable)
                                    embed.addField("Role Mentionable", `Old Setting: ${oldRole.mentionable} New Setting: ${newRole.mentionable}`);
                            }
                            if (e.key === 'name') { // Name Change
                                if (oldRole.name !== newRole.name) {
                                    embed.addField("Old Name", oldRole.name)
                                        .addField("New Name", newRole.name);
                                }
                            } else {
                                if (!embed.fields.find(f => f.name === 'Role Name'))
                                    embed.addField("Role Name", newRole.name);
                            }
                            if (e.key === 'permissions') { // Permission Change
                                if (oldRole.permissions !== newRole.permissions) {
                                    embed.addField("Old Permission Number", oldRole.permissions.bitfield)
                                        .addField("New Permission Number", newRole.permissions.bitfield)
                                        .setDescription("[What is a permission number?](https://discordapi.com/permissions.html)");
                                }
                            }
                        });
                        if (embed.fields.length === 1 || embed.fields.length === 0) return;

                        selectedChannel.send(embed);

                        /* Old System
    
                        var embed = new Discord.RichEmbed();
                        if (oldRole.position === newRole.position) {
                            embed
                                .setTitle("Role Edited")
                                .addField("Old Role Name", oldRole.name ? oldRole.name : "Unknown")
                                .addField("New Role Name", newRole.name ? newRole.name : "Unknown")
                                .addField("Old Role Position", oldRole.position ? oldRole.position : "Unknown")
                                .addField("New Role Position", newRole.position ? newRole.position : "Unknown")
                                .addField("Old Role HEX Color", oldRole.hexColor ? oldRole.hexColor : "Unknown")
                                .addField("New Role HEX Color", newRole.hexColor ? newRole.hexColor : "Unknown")
                                .addField("Old Role Permission Number", oldRole.permissions ? oldRole.permissions : "Unknown")
                                .addField("New Role Permission Number", newRole.permissions ? newRole.permissions : "Unknown")
                                .setColor(0x00FFFF)
                                .setTimestamp();
                        } else if (oldRole.name !== newRole.name || oldRole.permissions !== newRole.permissions || oldRole.hexColor !== newRole.hexColor) {
                            embed
                                .setTitle("Role Edited")
                                .addField("Old Role Position", oldRole.position ? oldRole.position : "Unknown")
                                .addField("New Role Position", newRole.position ? newRole.position : "Unknown")
                                .addField("Old Role Name", oldRole.name ? oldRole.name : "Unknown")
                                .addField("New Role Name", newRole.name ? newRole.name : "Unknown")
                                .addField("Old Role HEX Color", oldRole.hexColor ? oldRole.hexColor : "Unknown")
                                .addField("New Role HEX Color", newRole.hexColor ? newRole.hexColor : "Unknown")
                                .addField("Old Role Permission Number", oldRole.permissions ? oldRole.permissions : "Unknown")
                                .addField("New Role Permission Number", newRole.permissions ? newRole.permissions : "Unknown")
                                .setColor(0x00FFFF)
                                .setTimestamp();
                        } else return;
                        selectedChannel.send("", { embed: embed });
                        */
                    }
                    let row = await sql.get(`SELECT * FROM actionlog WHERE guildId = ${oldRole.guild.id}`);
                    if (row && row.bool) {
                        roleUpdate();
                    }
                }

                let r2 = await sql.get(`SELECT * FROM logChannel WHERE guildId = ${newRole.guild.id}`);
                if (!r2) {
                    logChannel(newRole.guild.channels.find(c => c.name === "action-log"));
                } else {
                    logChannel(newRole.guild.channels.get(r2.channelId));
                }
            } catch (e) {
                let rollbar = new client.Rollbar(client.rollbarKey);
                rollbar.error("Something went wrong in roleUpdate.js", e);
                console.log(e);
            }
        });
    }
}