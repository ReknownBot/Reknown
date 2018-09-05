module.exports = {
    func: async (client, sql, Discord) => {
        client.bot.on("roleUpdate", async (oldRole, newRole) => {
            try {
                if (!newRole.guild.me)
                    newRole.guild.me = await newRole.guild.members.fetch({
                        user: client.bot.user,
                        cache: true
                    });
                if (!newRole.guild.me.hasPermission("VIEW_AUDIT_LOG")) return;
                async function logChannel(selectedChannel) {
                    if (!selectedChannel) return;
                    if (!newRole.guild.me.permissionsIn(selectedChannel).has("SEND_MESSAGES") && !newRole.guild.me.hasPermission("ADMINISTRATOR")) return;
                    if (!newRole.guild.me.permissionsIn(selectedChannel).has("VIEW_CHANNEL") && !newRole.guild.me.hasPermission("ADMINISTRATOR")) return;
                    if (oldRole === newRole || !oldRole || !newRole) return;
                    async function roleUpdate() {
                        if (!newRole.guild.me.hasPermission("VIEW_AUDIT_LOG")) return;
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
                                if (oldRole.permissions.bitfield !== newRole.permissions.bitfield) {
                                    embed.addField("Old Permission Number", oldRole.permissions.bitfield)
                                        .addField("New Permission Number", newRole.permissions.bitfield)
                                        .setDescription("[What is a permission number?](https://discordapi.com/permissions.html)");
                                }
                            }
                        });
                        if (embed.fields.length <= 1) return;
                        if (embed.fields.find(field => field.name === "Old Name") && embed.fields.find(field => field.name === "Role Name"))
                            embed.fields.find(field => field.name === "Role Name") = undefined;

                        selectedChannel.send(embed);
                    }
                    let row = (await sql.query('SELECT * FROM actionlog WHERE guildId = $1', [newRole.guild.id])).rows[0];
                    if (row && row.bool)
                        roleUpdate();
                }

                let r2 = (await sql.query('SELECT * FROM logChannel WHERE guildId = $1', [newRole.guild.id])).rows[0];
                if (!r2)
                    logChannel(newRole.guild.channels.find(c => c.name === "action-log"));
                else
                    logChannel(newRole.guild.channels.get(r2.channelid));
            } catch (e) {
                let rollbar = new client.Rollbar(client.rollbarKey);
                rollbar.error("Something went wrong in roleUpdate.js", e);
                console.error(e);
            }
        });
    }
}