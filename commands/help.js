module.exports = {
    help: 'Displays all the commands. `Usage: ?help [Command Name]`',
    func: async (client, message, args, unknownCommand, mess, sql, Discord, fs, PREFIX, bool) => {
            try {
                async function help(sMessage) {
                    // No args aka list commands
                    if (!args[1]) {
                        function listCommands(guildID, userID) {
                            let jyguyID = '288831103895076867';

                            function push(commandArray, item) {
                                // If the message author ID is Jyguy, add it to the list regardless of guilds
                                if (userID === jyguyID) {
                                    commandArray.push(command);
                                    // From now on the member will be 100% not jyguy
                                } else if (!item.jyguyOnly)
                                    commandArray.push(command);
                            }
                            let modArray = [];
                            let funArray = [];
                            let miscArray = [];
                            for (var command in client.commands) {
                                let item = client.commands[command];
                                if (item.category === 'moderation')
                                    push(modArray, item);
                                else if (item.category === 'fun')
                                    push(funArray, item);
                                else if (item.category === 'misc')
                                    push(miscArray, item);
                                else
                                    console.log('aaaaaaaaaaaaaaaa ' + command);
                            }
                            let embed = new Discord.MessageEmbed()
                                .setTitle("Command List")
                                .setColor(0x00FFFF)
                                .addField("Moderation", modArray.list(), true)
                                .addField("Fun", funArray.list(), true)
                                .addField("Misc.", miscArray.list(), true)
                                .setFooter(`You can always use ${PREFIX}help <command> to get more information about a command!`);

                            message.author.send(embed)
                                .then(() => message.channel.send("Check your DMs!"))
                                .catch(e => {
                                    if (e != 'DiscordAPIError: Cannot send messages to this user') {
                                        let rollbar = new client.Rollbar(client.rollbarKey);
                                        rollbar.error("Something went wrong in help.js", e);
                                        console.error;
                                        client.editMsg(sMessage, "Something went wrong, consider joining our support server for updates.", message);
                                    } else
                                        client.editMsg(sMessage, "You have DMs disabled! Please turn it back on to see the commands. Alternatively, you can view the commands at our website here: <http://reknownbot.herokuapp.com/commands.html>", message);
                                });
                        }

                        if (message.guild.id === client.spikeGuildID)
                            listCommands(client.spikeGuildID, message.author.id);
                        else if (message.guild.id === client.spigetGuildID)
                            listCommands(client.spikeGuildID, message.author.id);
                        else
                            listCommands('none', message.author.id);
                    } else { // Yes args
                        if (args[1] in client.commands) {
                            let item = client.commands[args[1]];
                            if (message.author.id === '288831103895076867')
                                client.editMsg(sMessage, `${PREFIX + args[1]} :: ${item.help}`, message);
                            // Member can't be Jyguy this point forward
                            // If default
                            else if (!item.jyguyOnly)
                                client.editMsg(sMessage, `${PREFIX + args[1]} :: ${item.help}`, message);
                            // If private
                            else
                                client.editMsg(sMessage, `I did not find \`${args[1]}\` in my command list!`, message);
                        } else {
                            client.editMsg(sMessage, `I did not find \`${args[1]}\` in my command list!`, message);
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
                    help(msgToEdit);
                } else {
                    help(message);
                }
            } catch (e) {
                let rollbar = new client.Rollbar(client.rollbarKey);
                rollbar.error("Something went wrong in help.js", e);
                console.error;
                message.channel.send(`Something went wrong while executing the command: \`${PREFIX}help\`\n\n\`\`\`xl\n${e}\n\`\`\``);
            }
        },
        jyguyOnly: 0,
        category: "misc"
}