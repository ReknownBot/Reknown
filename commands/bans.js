module.exports = {
    help: "Lists the bans on the server. (Ban Members permission required)",
    func: async (client, message, args, unknownCommand, mess, sql, Discord, fs, PREFIX, bool) => {
            try {
                async function bans(sMessage) {
                    // Checks for the custom permission
                    let bool2 = false;
                    let i = 0;
                    let prom = new Promise(resolve => {
                        message.member.roles.forEach(async role => {
                            let row = await sql.query('SELECT * FROM permissions WHERE roleID = ? AND pName = ? AND pCategory = ?', [role.id, "ban", "mod"]).rows[0];
                            if ((row && row.bool) || message.member === message.guild.owner)
                                bool2 = true;
                            i++;
                            if (i === message.member.roles.size)
                                setTimeout(resolve, 10);
                        });
                    });
                    await prom;
                    if (!bool2) return client.editMsg(sMessage, ":x:, Sorry, but you do not have the `mod.ban` permission.", message);

                    if (!message.guild.me.hasPermission("BAN_MEMBERS")) return client.editMsg(sMessage, 'I do not have enough permissions!', message);
                    if (!message.guild.me.permissionsIn(message.channel).has("ADD_REACTIONS")) return client.editMsg(sMessage, "I do not have enough permissions to put reactions! Make sure I have that permission for this command.", message);
                    let bans = await message.guild.fetchBans();
                    if (bans.size < 1)
                        client.editMsg(sMessage, 'There are no bans for this server currently!', message);
                    else {
                        let pages = [];
                        let page = 1;

                        let str = '';
                        bans.forEach(ban => {
                            if (str.length > 2000) {
                                pages.push(str);
                                str = '';
                            }
                            str += `**${ban.user.tag}** :: **${ban.user.id}**\n`;
                        });
                        if (str) pages.push(str);

                        let embed = new Discord.MessageEmbed()
                            .setTitle(`Bans in ${message.guild.name}`)
                            .setColor(0x00FFFF)
                            .setFooter(`Page ${page} of ${pages.length}`)
                            .setDescription(pages[page - 1]);
                        if (pages.length !== 1) {
                            let msg = await client.editMsg(sMessage, embed, message);
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

                            backwards.on("collect", () => {
                                if (page === 1) return message.channel.send("You cannot go before page 1!").then(m => m.delete({
                                    timeout: 5000
                                }));
                                page--;
                                embed.setDescription(pages[page - 1])
                                    .setFooter(`Page ${page} of ${pages.length}`);
                                msg.edit(embed);
                            });

                            forwards.on('collect', () => {
                                if (page === pages.length) return message.channel.send(`You cannot go beyond page ${pages.length}!`).then(m => m.delete({
                                    timeout: 5000
                                }));
                                page++;
                                embed.setDescription(pages[page - 1])
                                    .setFooter(`Page ${page} of ${pages.length}`);
                                msg.edit(embed);
                            });
                            backwards.on('end', () => {
                                msg.reactions.forEach(r2 => {
                                    if (r2.users.has(client.bot.user.id))
                                        r2.remove();
                                });
                            });
                        } else
                            client.editMsg(sMessage, embed, message);
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
                    bans(msgToEdit);
                } else {
                    bans(message);
                }
            } catch (e) {
                let rollbar = new client.Rollbar(client.rollbarKey);
                rollbar.error("Something went wrong in bans.js", e);
                console.error;
                message.channel.send(`Something went wrong while executing the command: \`${PREFIX}bans\`\n\n\`\`\`xl\n${e}\n\`\`\``);
            }
        },
        jyguyOnly: 0,
        category: "moderation"
}