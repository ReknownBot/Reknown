module.exports = {
    help: "Blacklists a member from me! Use unblacklist to remove. (Manage Guild Permission Required) `Usage: ?blacklist <Member>`",
    func: async (client, message, args, unknownCommand, mess, sql, Discord, fs, PREFIX, bool) => {
            try {
                async function blacklist(sMessage) {
                    // Checks for the custom permission
                    let bool2 = false;
                    let i = 0;
                    let prom = new Promise(resolve => {
                        message.member.roles.forEach(async role => {
                            let row = await sql.get('SELECT * FROM permissions WHERE roleID = ? AND pName = ? AND pCategory = ?', [role.id, "blacklist", "mod"]);
                            if ((row && row.bool) || message.member === message.guild.owner)
                                bool2 = true;
                            i++;
                            if (i === message.member.roles.size)
                                setTimeout(resolve, 10);
                        });
                    });
                    await prom;
                    if (!bool2) return client.editMsg(sMessage, ":x:, Sorry, but you do not have the `mod.blacklist` permission.", message);

                    if (!args[1]) return client.editMsg(sMessage, "You have to mention or give me the ID of a member for me to blacklist!", message);
                    let selectedMember = message.guild.members.get(args[1] ? args[1].replace(/[<>@&!]/g, "") : null);
                    if (!selectedMember) return client.editMsg(sMessage, "You have to mention or give me the ID of a member for me to blacklist!", message);

                    if (selectedMember === message.member) return client.editMsg(sMessage, "You cannot blacklist yourself!", message);
                    if (selectedMember.roles.highest.position >= message.member.roles.highest.position && message.member.id !== "288831103895076867" && message.mmber !== message.guild.owner) return client.editMsg(sMessage, "You cannot blacklist members that have the same role or above yours!", message);

                    let row = await sql.get(`SELECT * FROM blacklist WHERE guildId = ${message.guild.id} AND userId = ${selectedMember.id}`);
                    if (row) {
                        client.editMsg(sMessage, "That user is already blacklisted!", message);
                    } else {
                        client.editMsg(sMessage, "Please give me the reason to blacklist this member. (Message Collector)", message);
                        let collector = message.channel.createMessageCollector(m => m.author.id === message.author.id && m.channel.id === message.channel.id, {
                            time: 60000
                        });
                        collector.on('collect', collected => {
                            if (collected.content.length < 1) {
                                collector.stop();
                                client.editMsg(sMessage, "That is not a valid message! Please try again and send letters, not files.", message);
                                return;
                            }
                            collector.stop();
                            let reason = collected.content;
                            sql.run("INSERT INTO blacklist (userId, guildId, reason, by) VALUES (?, ?, ?, ?)", [selectedMember.id, message.guild.id, reason, `${message.author.tag} (${message.author.id})`]);
                            client.editMsg(sMessage, `:+1:, Successfully blacklisted ${selectedMember.user.tag} (${selectedMember.id}) for ${reason}`, message);
                        });

                        collector.on('end', collected => {
                            if (collected.size < 1) return message.reply(" You did not answer fast enough!");
                        });
                    }
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
                    blacklist(msgToEdit);
                } else {
                    blacklist(message);
                }
            } catch (e) {
                let rollbar = new client.Rollbar(client.rollbarKey);
                rollbar.error("Something went wrong in blacklist.js", e);
                message.channel.send(`Something went wrong while executing the command: \`${PREFIX}blacklist\`\n\n\`\`\`xl\n${e}\n\`\`\``);
                console.error(e);
            }
        },
        jyguyOnly: 0,
        category: "moderation"
}