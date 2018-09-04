module.exports = {
    help: "This command displays warnings! `Usage: ?warnings [Member]`",
    func: async (client, message, args, unknownCommand, mess, sql, Discord, fs, PREFIX, bool) => {
            try {
                async function warningscmd(sMessage) {
                    let selectedMember = message.guild.members.get(args[1] ? args[1].replace(/[<>@&!]/g, "") : null);
                    if (!selectedMember) { // If no members were mentioned
                        let embedThingy = new Discord.MessageEmbed()
                            .setTitle("Your Warnings")
                            .setColor(0x00FFFF)
                            .setTimestamp();
                        let { rows } = await sql.query('SELECT warnAmount FROM warnings WHERE userId2 = $1 ORDER BY warnAmount DESC', [message.author.id + message.guild.id]);
                        let warnAmountThingy = [];
                        rows.forEach(row => {
                            warnAmountThingy.push(row.warnAmount);
                        });
                        embedThingy.addField("Warning Amount:", warnAmountThingy[0] ? warnAmountThingy[0] : "0");
                        let { rows: rows2 } = await sql.query('SELECT * FROM warnings WHERE userId2 = $1', [message.author.id + message.guild.id]);
                        let warnReasonThingy = [];
                        rows2.forEach(row => {
                            warnReasonThingy.push(`${row.warnReason} (${row.warnID})`);
                        });
                        if (warnReasonThingy.join("\n").length <= 1024) {
                            embedThingy.addField("Warning Informations:", warnReasonThingy[0] ? warnReasonThingy : "None");
                            client.editMsg(sMessage, embedThingy, message);
                        } else {
                            let pages = [{
                                title: "Your Warnings",
                                color: 0x00FFFF,
                                timestamp: new Date(),
                                fields: [embedThingy.fields[0]]
                            }];
                            let page = 1;
                            let str = '';
                            rows2.forEach(row => {
                                if (str.length) {
                                    pages.push({
                                        title: "Your Warnings",
                                        color: 0x00FFFF,
                                        timestamp: new Date(),
                                        fields: [{
                                            name: "Warning Informations",
                                            value: str
                                        }]
                                    });
                                    str = '';
                                }
                                str += `${row.warnReason} (${row.warnID})`;
                            });
                            if (str) {
                                pages.push({
                                    title: "Your Warnings",
                                    color: 0x00FFFF,
                                    timestamp: new Date(),
                                    fields: [{
                                        name: "Warning Informations",
                                        value: str
                                    }]
                                });
                            }
                            let embed = new Discord.MessageEmbed(pages[0])
                                .setFooter(`Page ${page} of ${pages.length}}`);
                            let msg = await message.channel.send(embed);
                            await msg.react('◀');
                            await msg.react('▶');

                            let backwardFilter = (reaction, user) => reaction.emoji.name === '◀' && user.id === message.author.id;
                            let forwardFilter = (reaction, user) => reaction.emoji.name === '▶' && user.id === message.author.id;

                            const backwards = msg.createReactionCollector(backwardFilter, {
                                time: 60000
                            });
                            const forwards = msg.createReactionCollector(forwardFilter, {
                                time: 60000
                            });

                            backwards.on("collect", r => {
                                if (page === 1) return message.channel.send("You cannot go before page 1!").then(m => m.delete({
                                    timeout: 5000
                                }));
                                page--;
                                embed = new Discord.MessageEmbed(pages[page - 1])
                                    .setFooter(`Page ${page} of ${pages.length}`);
                                msg.edit(embed);
                            });

                            forwards.on('collect', r => {
                                if (page === pages.length) return message.author.send(`You cannot go beyond page ${pages.length}!`).then(m => m.delete({
                                    timeout: 5000
                                })).catch(e => {
                                    if (e != 'DiscordAPIError: Cannot send messages to this user') {
                                        let rollbar = new client.Rollbar(client.rollbarKey);
                                        rollbar.error("Something went wrong in rules.js", e);
                                    }
                                });
                                page++;
                                embed = new Discord.MessageEmbed(pages[page - 1])
                                    .setFooter(`Page ${page} of ${pages.length}`);
                                msg.edit(embed);
                            });

                            backwards.on('end', r => {
                                msg.reactions.forEach(r2 => {
                                    if (r2.users.has(client.bot.user.id))
                                        r2.remove();
                                });
                            });
                        }
                    } else { // If a member was mentioned
                        let embedThingy = new Discord.MessageEmbed()
                            .setTitle("Their Warnings")
                            .setColor(0x00FFFF)
                            .setTimestamp();
                        let { rows } = await sql.query('SELECT * FROM warnings WHERE userId2 = $1 ORDER BY warnAmount DESC', [selectedMember.id + message.guild.id]);
                        let warnAmountThingy = [];
                        rows.forEach(row => {
                            warnAmountThingy.push(row.warnamount);
                        });
                        embedThingy.addField("Warning Amount", warnAmountThingy[0] ? warnAmountThingy[0] : "0");
                        let { rows: rows2 } = await sql.query('SELECT * FROM warnings WHERE userId2 = $1', [selectedMember.id + message.guild.id]);
                        let warnReasonThingy = [];
                        rows2.forEach(row => {
                            warnReasonThingy.push(`${row.warnreason} (${row.warnid})`);
                        });
                        if (warnReasonThingy.join("\n").length <= 1024) {
                            embedThingy.addField("Warning Informations:", warnReasonThingy[0] ? warnReasonThingy : "None");
                            client.editMsg(sMessage, embedThingy, message);
                        } else {
                            let pages = [{
                                title: "Their Warnings",
                                color: 0x00FFFF,
                                timestamp: new Date(),
                                fields: [embedThingy.fields[0]]
                            }];
                            let page = 1;
                            let str = '';
                            rows2.forEach(row => {
                                if (str.length) {
                                    pages.push({
                                        title: "Their Warnings",
                                        color: 0x00FFFF,
                                        timestamp: new Date(),
                                        fields: [{
                                            name: "Warning Informations",
                                            value: str
                                        }]
                                    });
                                    str = '';
                                }
                                str += `${row.warnreason} (${row.warnid})`;
                            });
                            if (str) {
                                pages.push({
                                    title: "Their Warnings",
                                    color: 0x00FFFF,
                                    timestamp: new Date(),
                                    fields: [{
                                        name: "Warning Informations",
                                        value: str
                                    }]
                                });
                            }
                            let embed = new Discord.MessageEmbed(pages[0])
                                .setFooter(`Page ${page} of ${pages.length}}`);
                            let msg = await message.channel.send(embed);
                            await msg.react('◀');
                            await msg.react('▶');

                            let backwardFilter = (reaction, user) => reaction.emoji.name === '◀' && user.id === message.author.id;
                            let forwardFilter = (reaction, user) => reaction.emoji.name === '▶' && user.id === message.author.id;

                            const backwards = msg.createReactionCollector(backwardFilter, {
                                time: 60000
                            });
                            const forwards = msg.createReactionCollector(forwardFilter, {
                                time: 60000
                            });

                            backwards.on("collect", r => {
                                if (page === 1) return message.channel.send("You cannot go before page 1!").then(m => m.delete({
                                    timeout: 5000
                                }));
                                page--;
                                embed = new Discord.MessageEmbed(pages[page - 1])
                                    .setFooter(`Page ${page} of ${pages.length}`);
                                msg.edit(embed);
                            });

                            forwards.on('collect', r => {
                                if (page === pages.length) return message.author.send(`You cannot go beyond page ${pages.length}!`).then(m => m.delete({
                                    timeout: 5000
                                })).catch(e => {
                                    if (e != 'DiscordAPIError: Cannot send messages to this user') {
                                        let rollbar = new client.Rollbar(client.rollbarKey);
                                        rollbar.error("Something went wrong in warnings.js", e);
                                    }
                                });
                                page++;
                                embed = new Discord.MessageEmbed(pages[page - 1])
                                    .setFooter(`Page ${page} of ${pages.length}`);
                                msg.edit(embed);
                            });

                            backwards.on('end', r => {
                                msg.reactions.forEach(r2 => {
                                    if (r2.users.has(client.bot.user.id))
                                        r2.remove();
                                });
                            });
                        }
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
                    warningscmd(msgToEdit);
                } else {
                    warningscmd(message);
                }
            } catch (e) {
                let rollbar = new client.Rollbar(client.rollbarKey);
                rollbar.error("Something went wrong in warnings.js", e);
                console.error(e);
                message.channel.send(`Something went wrong while executing the command: \`${PREFIX}warnings\`\n\n\`\`\`xl\n${e}\n\`\`\``);
            }
        },
        jyguyOnly: 0,
        category: "moderation"
}