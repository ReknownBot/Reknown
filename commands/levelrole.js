module.exports = {
    help: "Sets / Removes / Clears / Lists level roles. (level.role Required)\n`Usage: ?levelrole <Argument> [<Role Mention or ID>] [<Level Amount>]\nArguments: add, remove, clear, and list.`",
    func: async (client, message, args, unknownCommand, mess, sql, Discord, fs, PREFIX, bool) => {
        try {
            async function levelrolecmd(sMessage) {
                // Checks for custom perm
                // Checks for the custom permission
                let bool2 = false;
                let i = 0;
                let prom = new Promise(resolve => {
                    message.member.roles.forEach(async role => {
                        let row = (await sql.query('SELECT * FROM permissions WHERE roleID = $1 AND pName = $2 AND pCategory = $3', [role.id, "role", "level"])).rows[0];
                        if ((row && row.bool) || message.member === message.guild.owner)
                            bool2 = true;
                        i++;
                        if (i === message.member.roles.size)
                            setTimeout(resolve, 10);
                    });
                });
                await prom;
                if (!bool2) return client.editMsg(sMessage, ":x:, Sorry, but you do not have the `level.role` permission.", message);
                let row2 = (await sql.query('SELECT * FROM toggleLevel WHERE guildId = $1', [message.guild.id])).rows[0];
                if (!row2 || !row2.bool) return client.editMsg(sMessage, "The levelling system is disabled!", message);
                if (!args[1]) return client.editMsg(sMessage, "You have to put one of the arguments! `add, remove, clear, or list`", message);
                let choices = [
                    'add',
                    'remove',
                    'clear',
                    'list'
                ];
                let choice = args[1].toLowerCase();
                if (!choices.includes(choice)) return client.editMsg(sMessage, "That is not a valid argument! The arguments are: `add, remove, clear`, and `list`", message);
                if (choices[0] === choice) { // Add
                    if (!args[2]) return client.editMsg(sMessage, "You have to supply a role I can add the level role to!", message);
                    let role = message.guild.roles.get(args[2].replace(/[<>@&]/g, ""));
                    if (!role) return client.editMsg(sMessage, "That is not a valid role! Please supply a role mention or an ID.", message);
                    // Checks if the role is @everyone
                    if (role === message.guild.defaultRole) return client.editMsg(sMessage, "You cannot set the level role as `@everyone`!", message);
                    let row3 = (await sql.query("SELECT * FROM levelrole WHERE guildID = $1 AND roleID = $2", [message.guild.id, role.id])).rows[0];
                    if (row3) return client.editMsg(sMessage, "That role is already on the list!", message);
                    let level = args[3];
                    if (!level) return client.editMsg(sMessage, "You have to include a level when I should add the role!", message);
                    if (isNaN(level)) return client.editMsg(sMessage, "That is not a number!", message);
                    if (level < 1) return client.editMsg(sMessage, "It cannot be lower than 1!", message);
                    sql.query("INSERT INTO levelrole (guildID, roleID, level) VALUES ($1, $2, $3)", [message.guild.id, role.id, level]);
                    client.editMsg(sMessage, "Successfully added that role to the list.", message);
                } else if (choices[1] === choice) { // Remove
                    if (!args[2]) return client.editMsg(sMessage, "You have to supply a role I can remove the level role to!", message);
                    let role = message.guild.roles.get(args[2].replace(/[<>@&]/g, ""));
                    if (!role) return client.editMsg(sMessage, "That is not a valid role! Please supply a role mention or an ID.", message);
                    let row3 = (await sql.query("SELECT * FROM levelrole WHERE guildID = $1 AND roleID = $2", [message.guild.id, role.id])).rows[0];
                    if (!row3) return client.editMsg(sMessage, "That role is not on the list!", message);
                    sql.query("DELETE FROM levelrole WHERE guildID = $1 AND roleID = $2", [message.guild.id, role.id]);
                    client.editMsg(sMessage, "Successfully removed that role from the list.", message);
                } else if (choices[2] === choice) { // Clear
                    let { rows: row3 } = await sql.query("SELECT * FROM levelrole WHERE guildID = $1", [message.guild.id]);
                    if (!row3[0]) return client.editMsg(sMessage, "No roles are in the list currently!", message);
                    sql.query("DELETE FROM levelrole WHERE guildID = $1", [message.guild.id]);
                    client.editMsg(sMessage, "Successfully removed all roles from the list.", message);
                } else if (choices[3] === choice) { // List
                    let { rows: row3 } = await sql.query("SELECT * FROM levelrole WHERE guildID = $1", [message.guild.id]);
                    if (!row3[0]) return client.editMsg(sMessage, "No roles are in the list currently!", message);
                    let pages = [];
                    let page = 1;
                    let str = '';
                    row3.forEach(row4 => {
                        if (!message.guild.roles.get(row4.roleid))
                            return sql.query("DELETE FROM levelrole WHERE guildID = $1 AND roleID = $2", [message.guild.id, row4.roleid]);
                        if (str.length + (row4.roleid.length * 2) + new String(row4.level).length + 31 > 2048) {
                            pages.push(str);
                            str = '';
                        }
                        str += `Role: <@&${row4.roleid}> :: ID: ${row4.roleid} :: Level: ${row4.level}\n`;
                    });
                    if (str) pages.push(str);
                    if (!pages[0]) return client.editMsg(sMessage, "No roles are in the list currently!", message);
                    let embed = new Discord.MessageEmbed()
                        .setTitle(`${message.guild.name}'s Level Roles`)
                        .setColor(0x00FFFF)
                        .setFooter(`Page ${page} of ${pages.length}`)
                        .setDescription(pages[page - 1]);

                    if (pages.length > 1) {
                        let msg = await message.channel.send(embed);
                        await msg.react('⬅');
                        await msg.react('◀');
                        await msg.react('▶');
                        await msg.react('➡');
                        await msg.react("⛔");

                        let backwardFilter = (reaction, user) => reaction.emoji.name === '◀' && user.id === message.author.id;
                        let forwardFilter = (reaction, user) => reaction.emoji.name === '▶' && user.id === message.author.id;
                        let superBackwardFilter = (reaction, user) => reaction.emoji.name === '⬅' && user.id === message.author.id;
                        let superForwardFilter = (reaction, user) => reaction.emoji.name === '➡' && user.id === message.author.id;
                        let stopFilter = (reaction, user) => reaction.emoji.name === '⛔' && user.id === message.author.id;

                        const backwards = msg.createReactionCollector(backwardFilter, {
                            time: 60000
                        });
                        const forwards = msg.createReactionCollector(forwardFilter, {
                            time: 60000
                        });
                        const superBackwards = msg.createReactionCollector(superBackwardFilter, {
                            time: 60000
                        });
                        const superForwards = msg.createReactionCollector(superForwardFilter, {
                            time: 60000
                        });
                        const stop = msg.createReactionCollector(stopFilter, {
                            time: 60000
                        });

                        backwards.on("collect", () => {
                            if (page === 1) return message.channel.send("You cannot go before page 1!").then(m => m.delete({
                                timeout: 5000
                            })).catch(e => {
                                if (e != 'DiscordAPIError: Unknown Message') {
                                    console.log(e);
                                }
                            });
                            page--;
                            embed.setDescription(pages[page - 1])
                                .setFooter(`Page ${page} of ${pages.length}`);
                            msg.edit(embed);
                        });

                        forwards.on("collect", () => {
                            if (page === pages.length) return message.channel.send(`You cannot go after page ${pages.length}!`).then(m => m.delete({
                                timeout: 5000
                            })).catch(e => {
                                if (e != 'DiscordAPIError: Unknown Message') {
                                    console.log(e);
                                }
                            });
                            page++;
                            embed.setDescription(pages[page - 1])
                                .setFooter(`Page ${page} of ${pages.length}`);
                            msg.edit(embed);
                        });

                        superBackwards.on("collect", () => {
                            if (page === 1) return message.channel.send('You cannot go before page 1!').then(m => m.delete({
                                timeout: 5000
                            })).catch(e => {
                                if (e != 'DiscordAPIError: Unknown Message') {
                                    console.log(e);
                                }
                            });
                            page = 1;
                            embed.setDescription(pages[0])
                                .setFooter(`Page 1 of ${pages.length}`);
                            msg.edit(embed);
                        });

                        superForwards.on("collect", () => {
                            if (page === pages.length) return message.channel.send(`You cannot go after page ${pages.length}!`).then(m => m.delete({
                                timeout: 5000
                            })).catch(e => {
                                if (e != 'DiscordAPIError: Unknown Message') {
                                    console.log(e);
                                }
                            });
                            page = pages.length;
                            embed.setDescription(pages[page - 1])
                                .setFooter(`Page ${page} of ${pages.length}`);
                            msg.edit(embed);
                        });

                        stop.on("collect", () => {
                            stop.stop();
                            backwards.stop();
                            forwards.stop();
                            superBackwards.stop();
                            superForwards.stop();
                            msg.reactions.forEach(r2 => {
                                if (r2.users.has(client.bot.user.id))
                                    r2.remove();
                            });
                        });

                        backwards.on("end", () => {
                            msg.reactions.forEach(r2 => {
                                if (r2.users.has(client.bot.user.id))
                                    r2.remove();
                            });
                        });
                    } else {
                        client.editMsg(sMessage, embed, message);
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
                levelrolecmd(msgToEdit);
            } else {
                levelrolecmd(message);
            }
        } catch (e) {
            message.channel.send(`Something went wrong while executing the command: \`${PREFIX}levelrole\`\n\n\`\`\`xl\n${e}\n\`\`\``);
            console.error(e);
            let rollbar = new client.Rollbar(client.rollbarKey);
            rollbar.error("Something went wrong in levelrole.js", e);
        }
    },
    jyguyOnly: 0,
    category: "misc"
}
