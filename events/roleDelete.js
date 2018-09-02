module.exports = {
    func: async (client, sql, Discord) => {
        client.bot.on("roleDelete", async role => {
            try {
                if (!role.guild) return;
                if (!role.guild.me) return;
                if (!role.guild.me.hasPermission("VIEW_AUDIT_LOG")) return;
                async function logChannel(selectedChannel) {
                    async function roleDelete() {
                        if (!selectedChannel) return;
                        if (!role.guild.me.hasPermission("SEND_MESSAGES")) return;
                        if (!role.guild.me.hasPermission("VIEW_CHANNEL")) return;
                        if (!role.guild.me.permissionsIn(selectedChannel).has("SEND_MESSAGES")) {
                            if (!role.guild.me.hasPermission("ADMINISTRATOR")) return;
                        }
                        if (!role.guild.me.permissionsIn(selectedChannel).has("VIEW_CHANNEL")) {
                            if (!role.guild.me.hasPermission("ADMINISTRATOR")) return;
                        }
                        //console.log("roleDelete");
                        let audit = await role.guild.fetchAuditLogs({
                            limit: 1,
                            type: 32
                        });
                        let info = audit.entries.first();
                        let embed = new Discord.MessageEmbed()
                            .setAuthor(info.executor.tag, info.executor.displayAvatarURL())
                            .setTitle("Role Deleted")
                            .addField("Time", info.createdAt)
                            .addField("Reason", info.reason ? info.reason : "None")
                            .addField("Role", role.name + ` (${role.id})`)
                            .addField("Role HEX Color", role.hexColor)
                            .setFooter(`Log ID: ${info.id}`)
                            .setColor(0xFF0000);

                        selectedChannel.send(embed);

                        /* Old System
                        var embed = new Discord.RichEmbed()
                            .setTitle("Role Deleted")
                            .addField("Role Name:", role.name)
                            .addField("Role HEX Color:", role.hexColor)
                            .setColor(0x00FFFF);
                        selectedChannel.send(embed);
                        */
                    }
                    let row = await sql.get(`SELECT * FROM actionlog WHERE guildId = ${role.guild.id}`);
                    if (row && row.bool) {
                        roleDelete();
                    }
                }

                let r2 = await sql.get(`SELECT * FROM logChannel WHERE guildId = ${role.guild.id}`);
                if (!r2) {
                    logChannel(role.guild.channels.find(c => c.name === "action-log"));
                } else {
                    logChannel(role.guild.channels.get(r2.channelId));
                }
            } catch (e) {
                let rollbar = new client.Rollbar(client.rollbarKey);
                rollbar.error("Something went wrong in roleDelete.js", e);
                console.log(e);
            }
        });
    }
}