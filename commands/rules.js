module.exports = {
    help: "This command displays the rules! Optional Params: add, remove, and clear. For remove, use just `rules` and it will send you the info, copy the ENTIRE rule and paste it after the word remove. (misc.rules required for arguments) `Usage: ?rules [Argument] [Value]`",
    func: async (client, message, args, unknownCommand, mess, sql, Discord, fs, PREFIX, bool) => {
        try {
            async function rulescmd(sMessage) {
                if (!args[1]) {
                    let { rows: r } = await sql.query('SELECT * FROM rules WHERE guildId = $1', [message.guild.id]);
                    if (r.length === 0) return client.editMsg(sMessage, 'The guild does not have custom rules yet!', message);

                    let pages = [];
                    let page = 1;

                    let str = '';
                    let num = 1;
                    r.forEach(row => {
                        if (str.length + row.rule.length + 7 + num.toString().length > 2048) {
                            pages.push(str);
                            str = '';
                        }
                        str += `**${num}.** ${row.rule}\n`;
                        num++;
                    });
                    if (str) pages.push(str);

                    let embed = new Discord.MessageEmbed()
                        .setTitle(`Rules in ${message.guild.name}`)
                        .setColor(0x00FFFF)
                        .setFooter(`Page ${page} of ${pages.length}`)
                        .setDescription(pages[page - 1]);
                    if (pages.length !== 1) {
                        let msg = await message.author.send(embed);
                        if (!msg) return client.editMsg(sMessage, 'You have DMs disabled!', message);
                        message.channel.send("Check your DMs!");
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
                            if (page === 1) return message.author.send("You cannot go before page 1!").then(m => m.delete({
                                timeout: 5000
                            })).catch(e => {
                                if (e != 'DiscordAPIError: Cannot send messages to this user' && e != "DiscordAPIError: Unknown Message") {
                                    let rollbar = new client.Rollbar(client.rollbarKey);
                                    rollbar.error("Something went wrong in rules.js", e);
                                }
                            });
                            page--;
                            embed.setDescription(pages[page - 1])
                                .setFooter(`Page ${page} of ${pages.length}`);
                            msg.edit(embed);
                        });

                        forwards.on('collect', () => {
                            if (page === pages.length) return message.author.send(`You cannot go beyond page ${pages.length}!`).then(m => m.delete({
                                timeout: 5000
                            })).catch(e => {
                                if (e != 'DiscordAPIError: Cannot send messages to this user' && e != "DiscordAPIError: Unknown Message") {
                                    let rollbar = new client.Rollbar(client.rollbarKey);
                                    rollbar.error("Something went wrong in rules.js", e);
                                }
                            });
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
                    } else {
                        message.author.send(embed).then(() => message.channel.send("Check your DMs!")).catch(e => {
                            if (e != 'DiscordAPIError: Cannot send messages to this user') {
                                let rollbar = new client.Rollbar(client.rollbarKey);
                                rollbar.error("Something went wrong in rules.js", e);
                                console.log(e);
                                client.editMsg(sMessage, "Something went wrong while executing this command. The error has been recorded.", message);
                            } else
                                client.editMsg(sMessage, "You have DMs disabled! Please turn it back on.", message);
                        });
                    }
                } else if (args[1].toLowerCase() === 'add') {
                    // Checks for the custom permission
                    let bool2 = false;
                    let i = 0;
                    let prom = new Promise(resolve => {
                        message.member.roles.forEach(async role => {
                            let row = (await sql.query('SELECT * FROM permissions WHERE roleID = $1 AND pName = $2 AND pCategory = $3', [role.id, "rules", "misc"])).rows[0];
                            if ((row && row.bool) || message.member === message.guild.owner)
                                bool2 = true;
                            i++;
                            if (i === message.member.roles.size)
                                setTimeout(resolve, 10);
                        });
                    });
                    await prom;
                    if (!bool2) return client.editMsg(sMessage, ":x:, Sorry, but you do not have the `misc.rules` permission.", message);
                    let rule = args.slice(2).join(' ');
                    if (!rule) return client.editMsg(sMessage, "You have to supply a rule for me to add!", message);
                    if (rule.length > 1000) return client.editMsg(sMessage, "The rule may not exceed 1000 characters!", message);
                    sql.query('INSERT INTO rules (guildId, rule) VALUES ($1, $2)', [message.guild.id, rule]);
                    client.editMsg(sMessage, "Successfully added a rule.", message);
                } else if (args[1].toLowerCase() === 'remove') {
                    // Checks for the custom permission
                    let bool2 = false;
                    let i = 0;
                    let prom = new Promise(resolve => {
                        message.member.roles.forEach(async role => {
                            let row = (await sql.query('SELECT * FROM permissions WHERE roleID = $1 AND pName = $2 AND pCategory = $3', [role.id, "rules", "misc"])).rows[0];
                            if ((row && row.bool) || message.member === message.guild.owner)
                                bool2 = true;
                            i++;
                            if (i === message.member.roles.size)
                                setTimeout(resolve, 10);
                        });
                    });
                    await prom;
                    if (!bool2) return client.editMsg(sMessage, ":x:, Sorry, but you do not have the `misc.rules` permission.", message);
                    let rule = args.slice(2).join(' ');
                    if (!rule) return client.editMsg(sMessage, "You have to supply a rule for me to remove!", message);
                    let r = (await sql.query('SELECT rule FROM rules WHERE guildId = $1 AND rule = $2', [message.guild.id, rule.trim()])).rows[0];
                    if (!r) return client.editMsg(sMessage, "That rule does not exist! (Make sure it's EXACTLY the same.)", message);
                    sql.query('DELETE FROM rules WHERE guildId = $1 AND rule = $2', [message.guild.id, rule]);
                    client.editMsg(sMessage, "Successfully deleted the rule `" + rule + "`.", message);
                } else if (args[1].toLowerCase() === 'clear') {
                    // Checks for the custom permission
                    let bool2 = false;
                    let i = 0;
                    let prom = new Promise(resolve => {
                        message.member.roles.forEach(async role => {
                            let row = (await sql.query('SELECT * FROM permissions WHERE roleID = $1 AND pName = $2 AND pCategory = $3', [role.id, "rules", "misc"])).rows[0];
                            if ((row && row.bool) || message.member === message.guild.owner)
                                bool2 = true;
                            i++;
                            if (i === message.member.roles.size)
                                setTimeout(resolve, 10);
                        });
                    });
                    await prom;
                    if (!bool2) return client.editMsg(sMessage, ":x:, Sorry, but you do not have the `misc.rules` permission.", message);
                    let { rows } = await sql.query('SELECT * FROM rules WHERE guildId = $1', [message.guild.id]);
                    if (rows.length === 0) return client.editMsg(sMessage, "This guild does not have any custom rules!", message);
                    rows.forEach((r) => {
                        sql.query('DELETE FROM rules WHERE guildId = $1 AND rule = $2', [message.guild.id, r.rule]);
                    });
                    client.editMsg(sMessage, "Cleared all the rules.", message);
                } else {
                    client.editMsg(sMessage, "That is not a valid parameter! The params are: add, remove, and clear.", message);
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
                rulescmd(msgToEdit);
            } else {
                rulescmd(message);
            }
        } catch (e) {
            console.error(e);
            message.channel.send(`Something went wrong while executing the command: \`${PREFIX}rules\`\n\n\`\`\`xl\n${e}\n\`\`\``);
        }
    },
    jyguyOnly: 0,
    category: "misc"
}