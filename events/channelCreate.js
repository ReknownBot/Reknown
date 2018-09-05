module.exports = {
    func: async (client, sql, Discord) => {
        try {
            // Start the event
            client.bot.on("channelCreate", async channel => {
                // Define the guild
                let guild = channel.guild;

                if (!guild) return;

                // No perms? return
                if (!guild.me.hasPermission("VIEW_CHANNEL") || !guild.me.hasPermission("SEND_MESSAGES")) return;

                // Function with the log channel
                function logChannel(selectedChannel) {
                    // If the log channel does not exist return
                    if (!selectedChannel) return;

                    // Perm Checks
                    if (!guild.me.permissionsIn(selectedChannel).has("SEND_MESSAGES")) {
                        if (!message.guild.me.hasPermission("ADMINISTRATOR")) return;
                    }
                    if (!guild.me.permissionsIn(selectedChannel).has("VIEW_CHANNEL")) {
                        if (!guild.me.hasPermission("ADMINISTRATOR")) return;
                    }

                    // MessageEmbed constructor
                    let embed = new Discord.MessageEmbed()
                        .setTitle("Channel Created")
                        .addField("Name", channel.name, true)
                        .addField("ID", channel.id, true)
                        .addField("Topic", channel.topic ? channel.topic : "None", true)
						.addField("Type", channel.type, true)
                        .setColor(0x00FF00)
                        .setTimestamp();

                    // Send the embed
                    selectedChannel.send(embed);
                }

                // Gets the log channel set for the guild
                let r = (await sql.query('SELECT * FROM logChannel WHERE guildId = $1', [guild.id])).rows[0]; // Gets the SQL row
                let r2 = (await sql.query('SELECT * FROM actionlog WHERE guildId = $1', [guild.id])).rows[0];
                if (r2 && r2.bool) {
                    if (!r) { // If the row is not found i.e Default log channel
                        logChannel(guild.channels.find(c => c.name === "action-log"));
                    } else { // If it is found, run the function with the custom log channel
                        logChannel(guild.channels.get(r.channelId))
                    }
                }
            });
        } catch (e) {
            let rollbar = new client.Rollbar(client.rollbarKey);
            rollbar.error("Something went wrong in channelCreate.js", e);
            console.error;
        }
    }
}