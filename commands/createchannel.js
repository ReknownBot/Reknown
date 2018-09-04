module.exports = {
    help: "Creates a channel! (Manage Channels Permission Required) `Usage: ?createchannel <Channel Name>`",
    func: async (client, message, args, unknownCommand, mess, sql, Discord, fs, PREFIX, bool) => {
            try {
                async function createchannel(sMessage) {
                    // Checks for the custom permission
                    let bool2 = false;
                    let i = 0;
                    let prom = new Promise(resolve => {
                        message.member.roles.forEach(async role => {
                            let row = (await sql.query(`SELECT * FROM permissions WHERE roleID = '${role.id}' AND pName = 'ccreate' AND pCategory = 'mod'`)).rows[0];
                            if ((row && row.bool) || message.member === message.guild.owner)
                                bool2 = true;
                            i++;
                            if (i === message.member.roles.size)
                                setTimeout(resolve, 10);
                        });
                    });
                    await prom;
                    if (!bool2) return client.editMsg(sMessage, ":x:, Sorry, but you do not have the `mod.ccreate` permission.", message);
                    if (!message.guild.me.hasPermission("MANAGE_CHANNELS")) return client.editMsg(sMessage, "I do not have enough permissions to do that!", message);
                    let channelname = args.slice(1).join(" ");
                    if (!channelname) return client.editMsg(sMessage, "Please include a channel name.", message);
                    let collector = message.channel.createMessageCollector(msg => msg.author.id === message.author.id && msg.channel.id === message.channel.id, {
                        time: 30000
                    });
                    message.channel.send("And what type would you want? (Text, Voice or Category [T, V or C]) Ps. Say 'cancel' to abort.");
                    collector.on("collect", collected => {
                        if (collected.content.trim().toLowerCase() === "text" || collected.content.trim().toLowerCase() === "t") {
                            collector.stop();
                            if (channelname.trim().includes(" ")) return client.editMsg(sMessage, "You cannot include spaces in text channel names!", message);
                            message.guild.channels.create(channelname, {
                                type: "text"
                            }); // Creates a text channel
                            client.editMsg(sMessage, "Successfully created a text channel with the name of " + channelname + ".", message);
                        } else if (collected.content.trim().toLowerCase() === "voice" || collected.content.trim().toLowerCase() === "v") {
                            collector.stop();
                            message.guild.channels.create(channelname, {
                                type: "voice"
                            });
                            client.editMsg(sMessage, "Successfully created a voice channel with the name of " + channelname + ".", message);
                        } else if (collected.content.trim().toLowerCase() === "category" || collected.content.trim().toLowerCase() === "c") {
                            collector.stop();
                            message.guild.channels.create(channelname, {
                                type: "category"
                            });
                            client.editMsg(sMessage, "Successfully created a category with the name of " + channelname + ".", message);
                        } else if (collected.content.trim().toLowerCase() === "cancel") {
                            collector.stop();
                            client.editMsg(sMessage, ":ok:, Aborted action.", message);
                        } else { // If none of the options were called
                            collector.stop(); // Stops the collector
                            client.editMsg(sMessage, "None of the options were called. Aborting action.", message);
                        }
                    });
                    collector.on('end', collected => {
                        if (collected.size < 1) return client.editMsg(sMessage, "Time (30 Seconds) ran out, aborting action.", message);
                    });
                }

                if (bool) {
                    args = message.content.slice(PREFIX.length).split(' ');
                    for (let i = args.length - 1; i--;)
                    if (args[i] == '')
                        args.splice(i, 1);
                    let msgToEdit;
                    try {
                        msgToEdit = await message.channel.messages.fetch(client.msgEdit[message.id]);
                    } catch (e) {
                        msgToEdit = null;
                    }
                    createchannel(msgToEdit);
                } else {
                    createchannel(message);
                }
            } catch (e) {
                let rollbar = new client.Rollbar(client.rollbarKey);
                rollbar.error("Something went wrong in createchannel.js", e);
                console.error(e);
                message.channel.send(`Something went wrong while executing the command: \`${PREFIX}createchannel\`\n\n\`\`\`xl\n${e}\n\`\`\``);
            }
        },
        jyguyOnly: 0,
        category: "misc"
}