module.exports = {
    func: async (client, sql, Discord) => {
        client.bot.on("emojiDelete", async emoji => {
            try {
                if (!emoji.guild.me.hasPermission("VIEW_AUDIT_LOG")) return;
                let r = (await sql.query('SELECT * FROM logChannel WHERE guildId = $1', [emoji.guild.id])).rows[0];
                async function logChannel(selectedChannel) {
                    if (!selectedChannel) return;
                    if (!emoji.guild.me.permissionsIn(selectedChannel).has("SEND_MESSAGES") && !emoji.guild.me.hasPermission("ADMINISTRATOR")) return;
                    if (!emoji.guild.me.permissionsIn(selectedChannel).has("VIEW_CHANNEL") && !emoji.guild.me.hasPermission("ADMINISTRATOR")) return;
                    async function emojiDelete() {
                        let audit = await emoji.guild.fetchAuditLogs({
                            limit: 1,
                            type: 62 // Emoji Delete, look at https://discord.js.org/#/docs/main/master/typedef/AuditLogAction
                        });
                        let info = audit.entries.first();
                        let embed = new Discord.MessageEmbed()
                            .setAuthor(info.executor.tag, info.executor.displayAvatarURL())
                            .setTitle("Emoji Deleted")
                            .addField("Time", info.createdAt)
                            .addField("Emoji URL", emoji.url)
                            .addField("Emoji ID", emoji.id)
                            .setColor(0x00FFFF)
                            .setFooter(`Log ID: ${info.id}`);
                        selectedChannel.send(embed);
                    }
                    let row = (await sql.query('SELECT * FROM actionlog WHERE guildId = $1', [emoji.guild.id])).rows[0];
                    if (row && row.bool) {
                        emojiDelete();
                    }
                }
                if (!r) {
                    logChannel(emoji.guild.channels.find(c => c.name === "action-log"));
                } else {
                    logChannel(emoji.guild.channels.get(r.channelid));
                }
            } catch (e) {
                let rollbar = new client.Rollbar(client.rollbarKey);
                rollbar.error("Something went wrong in emojiDelete.js", e);
                console.error(e);
            }
        });
    }
}