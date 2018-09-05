module.exports = {
    func: async (client, sql, Discord) => {
        client.bot.on("guildBanRemove", async (guild, user) => {
            try {
                if (!guild.me.hasPermission("VIEW_AUDIT_LOG")) return;
                let r = (await sql.query('SELECT * FROM logChannel WHERE guildId = $1', [guild.id])).rows[0];
                async function logChannel(selectedChannel) {
                    if (!selectedChannel) return;
                    if (!guild.me.permissionsIn(selectedChannel).has("SEND_MESSAGES") && !guild.me.hasPermission("ADMINISTRATOR")) return;
                    if (!guild.me.permissionsIn(selectedChannel).has("VIEW_CHANNEL") && !guild.me.hasPermission("ADMINISTRATOR")) return;
                    async function guildBanRemove() {
                        let audit = await guild.fetchAuditLogs({
                            limit: 1,
                            type: 23 // Guild Ban Remove, look at https://discord.js.org/#/docs/main/master/typedef/AuditLogAction
                        });
                        let info = audit.entries.first();
                        let embed = new Discord.MessageEmbed()
                            .setAuthor(info.executor.tag, info.executor.displayAvatarURL())
                            .setTitle("Member Unbanned")
                            .addField("Time", info.createdAt)
                            .addField("Reason", info.reason ? info.reason : "None")
                            .addField("Member", info.target.tag + ` (${info.target.id})`)
                            .setThumbnail(info.target.displayAvatarURL())
                            .setColor(0x00FF00)
                            .setFooter(`Log ID: ${info.id}`);
                        selectedChannel.send(embed);
                    }
                    let row = (await sql.query('SELECT * FROM actionlog WHERE guildId = $1', [guild.id])).rows[0];
                    if (row && row.bool)
                        guildBanRemove();
                }
                if (!r) {
                    logChannel(guild.channels.find(c => c.name === "action-log"));
                } else {
                    logChannel(guild.channels.get(r.channelid));
                }
            } catch (e) {
                let rollbar = new client.Rollbar(client.rollbarKey);
                rollbar.error("Something went wrong in guildBanRemove.js", e);
                console.error(e);
            }
        });
    }
}