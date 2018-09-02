module.exports = {
    help: "This command remotebans people! `Usage: ?remoteban <Member ID> <Guild ID>`",
    func: async (client, message, args, unknownCommand, mess, sql, Discord, fs, PREFIX, bool) => {
        try {
            async function remotebancmd(sMessage) {
                if (message.member.id !== "288831103895076867") {
                    let arr = [];
                    client.commandsList.forEach(command => {
                        let rawcommand = command.slice(0, command.length - 3);
                        let item = client.commands[rawcommand];
                        let guildID = message.guild.id;
                        // If the message author ID is Jyguy, add it to the list regardless of guilds
                        if (message.author.id === '288831103895076867') {
                            arr.push(`${rawcommand} ${client.fuzz.ratio(rawcommand, args[0])}`);
                            // From now on the member will be 100% not jyguy
                        } else if (!item.jyguyOnly)
                            arr.push(`${rawcommand} ${client.fuzz.ratio(rawcommand, args[0])}`);
                    });
                    let arr2 = arr.sort((a, b) => {
                        return b.split(' ')[1] - a.split(' ')[1];
                    });
                    client.editMsg(sMessage, `Could not find the command. Did you mean \`${arr2[0].split(' ')[0]}, ${arr2[1].split(' ')[0]}, or ${arr2[2].split(' ')[0]}\`?`, message);
                    return;
                }
                let selectedMember = args[1];
                let selectedGuild2 = args[2];
                if (!selectedGuild2) return client.editMsg(sMessage, "You need to type in the ID of a guild in the third args!", message);
                let selectedGuild = client.bot.guilds.get(selectedGuild2.trim());
                if (!selectedGuild) {
                    message.channel.send("That guild wasn't found. Please make sure it is the right ID. If you want, I can send you the list of servers' IDs that I am in with the permission BAN MEMBERS. Do you want me to do that? ('Yes' or 'No')");
                    let collector = message.channel.createMessageCollector(m => m.author.id === message.author.id && m.channel.id === message.channel.id, {
                        time: 15000
                    });
                    collector.on("collect", collected => {
                        if (collected.content.trim().toLowerCase() === "yes") {
                            collector.stop();
                            client.editMsg(sMessage, "Sending you all instances of Guild IDs that I have the permission 'BAN_MEMBERS' in.", message);
                            let embed = new Discord.MessageEmbed()
                                .setTitle("All the Servers that I am in and that I have ban members permission:")
                                .setColor(0x00FFFF)
                                .setTimestamp();
                            embed.setDescription(client.bot.guilds.map(g => `${g.name} :: ${g.id}`));
                            message.author.send(embed).catch(e => {
                                if (e != 'DiscordAPIError: Cannot send messages to this user') {
                                    let rollbar = new client.Rollbar(client.rollbarKey);
                                    rollbar.error("Something went wrong in remoteban.js", e);
                                    console.log(e);
                                } else 
                                    message.channel.send("You have DMs disabled!");
                            });
                        } else if (collected.content.trim().toLowerCase() === "no") {
                            collector.stop();
                            client.editMsg(sMessage, "Ok.", message);
                        } else {
                            collector.stop();
                            client.editMsg(sMessage, "None of the options were called, aborting action.", message);
                        }
                    });
                    collector.on("end", collected => {
                        if (collected.size < 1) return client.editMsg(sMessage, "Time (15 Seconds) ran out, aborting action.", message);
                    });
                } else if (!selectedGuild.members.get(selectedMember)) client.editMsg(sMessage, "That user was not in **" + selectedGuild.name + "**! Please make sure it is the right ID. You can get all the IDs of the guild's members using " + PREFIX + "getallids <guildID>", message);
                else {
                    if (!selectedGuild.me.hasPermission("BAN_MEMBERS")) return client.editMsg(sMessage, "I do not have permissions to ban people on that server!", message);
                    if (selectedGuild.me.roles.highest.position <= selectedMember.roles.highest.position) return client.editMsg(sMessage, "I do not have enough permissions!", message);
                    selectedGuild.members.ban(selectedMember);
                    client.editMsg(sMessage, ":ok:, Banned **" + selectedGuild.members.get(selectedMember).user.tag + "** from **" + selectedGuild.name + "**.", message);
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
                remotebancmd(msgToEdit);
            } else {
                remotebancmd(message);
            }
        } catch (e) {
            let rollbar = new client.Rollbar(client.rollbarKey);
            rollbar.error("Something went wrong in remoteban.js", e);
            console.error(e);
            message.channel.send(`Something went wrong while executing the command: \`${PREFIX}remoteban\`\n\n\`\`\`xl\n${e}\n\`\`\``);
        }
    },
    jyguyOnly: 1,
    category: "moderation"
}