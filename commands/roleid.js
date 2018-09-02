module.exports = {
    help: "Gives the ID of a selected role. `Usage: ?roleid <Role>`",
    func: async (client, message, args, unknownCommand, mess, sql, Discord, fs, PREFIX, bool) => {
        try {
            async function roleidcmd(sMessage) {
                if (!args[1]) return client.editMsg(sMessage, "You have to include the name or mention the role for me to give the ID for!", message);
                let role = message.guild.roles.get(args[1] ? args[1].replace(/[<>@&]/g, "") : null);
                if (!role) {
                    role = args.slice(1).join(" ");
                    if (!message.guild.roles.find(r => r.name.toLowerCase() === role.toLowerCase())) return client.editMsg(sMessage, "I could not find that role!", message);
                    else {
                        let selectedRoles = message.guild.roles.filter(r => r.name.toLowerCase() === role.toLowerCase()).array();
                        if (selectedRoles.length === 1)
                            client.editMsg(sMessage, `The ID for ${selectedRoles[0].name} is \`${selectedRoles[0].id}\`.`, message);
                        else {
                            let pages = [];
                            let page = 1;
                            let colours = [];
                            let colour = 0;
                            selectedRoles.forEach(r => {
                                pages.push(`**${r.name}**\n\nID: ${r.id}\nHEX Color: ${r.hexColor}\nMember Count that has this Role: ${r.members.size}\nPermissions: ${Object.keys(Object.filter(new Discord.Permissions(r.permissions).serialize(), p => p)).list() || "None"}`);
                                colours.push(r.hexColor);
                            });

                            let embed = new Discord.MessageEmbed()
                                .setTitle("Role IDs")
                                .setFooter(`Role ${page} of ${pages.length}`)
                                .setDescription(pages[page - 1]);
                            let msg = await message.channel.send(embed);
                            await msg.react('⬅');
                            await msg.react('◀');
                            await msg.react('▶');
                            await msg.react('➡');
                            await msg.react('⛔');

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
                                colour--;
                                embed.setDescription(pages[page - 1])
                                    .setFooter(`Page ${page} of ${pages.length}`)
                                    .setColor(colours[colour]);
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
                                colour++;
                                embed.setDescription(pages[page - 1])
                                    .setFooter(`Page ${page} of ${pages.length}`)
                                    .setColor(colours[colour]);
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
                                colour = 0;
                                embed.setDescription(pages[0])
                                    .setFooter(`Page 1 of ${pages.length}`)
                                    .setColor(colours[colour]);
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
                                colour = colours.length - 1;
                                embed.setDescription(pages[page - 1])
                                    .setFooter(`Page ${page} of ${pages.length}`)
                                    .setColor(colours[colour]);
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
                                        r2.users.remove();
                                });
                            });

                            backwards.on("end", () => {
                                msg.reactions.forEach(r2 => {
                                    if (r2.users.has(client.bot.user.id))
                                        r2.users.remove();
                                });
                            });
                        }
                    }
                } else
                    client.editMsg(sMessage, `The ID for ${role.name} is \`${role.id}\`.`, message);
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
                roleidcmd(msgToEdit);
            } else {
                roleidcmd(message);
            }
        } catch (e) {
            let rollbar = new client.Rollbar(client.rollbarKey);
            rollbar.error("Something went wrong in roleid.js", e);
            console.error(e);
            message.channel.send(`Something went wrong while executing the command: \`${PREFIX}roleid\`\n\n\`\`\`xl\n${e}\n\`\`\``);
        }
    },
    jyguyOnly: 0,
    category: "misc"
}