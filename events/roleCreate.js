module.exports = {
    func: async (client, sql, Discord) => {
        client.bot.on("roleCreate", async role => {
            try {
                if (!role.guild.me.hasPermission("VIEW_AUDIT_LOG")) return;
                async function logChannel(selectedChannel) {
                    if (!selectedChannel) return;
                    if (!role.guild.me.permissionsIn(selectedChannel).has("SEND_MESSAGES") && !role.guild.me.hasPermission("ADMINISTRATOR")) return;
                    if (!role.guild.me.permissionsIn(selectedChannel).has("VIEW_CHANNEL") && !role.guild.me.hasPermission("ADMINISTRATOR")) return;
                    async function roleCreate() {
                        let audit = await role.guild.fetchAuditLogs({
                            limit: 1,
                            type: 30
                        });
                        let info = audit.entries.first();
                        let embed = new Discord.MessageEmbed()
                            .setAuthor(info.executor.tag, info.executor.displayAvatarURL())
                            .setTitle("Role Created")
                            .addField("Time", info.createdAt)
                            .addField("Reason", info.reason ? info.reason : "None")
                            .addField("Role", role.name + ` (${role.id})`)
                            .addField("Role HEX Color", role.hexColor)
                            .setFooter(`Log ID: ${info.id}`)
                            .setColor(0x00FF00);

                        selectedChannel.send(embed);
                    }
                    let row = (await sql.query('SELECT * FROM actionlog WHERE guildId = $1', [role.guild.id])).rows[0];
                    if (row && row.bool)
                        roleCreate();
                }

                let r2 = (await sql.query('SELECT * FROM logChannel WHERE guildId = $1', [role.guild.id])).rows[0];
                if (!r2)
                    logChannel(role.guild.channels.find(c => c.name === "action-log"));
                else
                    logChannel(role.guild.channels.get(r2.channelid));
            } catch (e) {
                let rollbar = new client.Rollbar(client.rollbarKey);
                rollbar.error("Something went wrong in roleCreate.js", e);
                console.error(e);
            }
        });
    }
}