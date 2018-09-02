module.exports = {
    help: "Uses the Hypixel API to gather information about various things.\n\n`Usage: ?hypixel player <Player Name> OR ?hypixel guild <Guild Name> OR ?hypixel guildmember <Member Name>",
    func: async (client, message, args, unknownCommand, mess, sql, Discord, fs, PREFIX, bool) => {
        try {
            async function hypixel(sMessage) {
                if (!args[1]) return client.editMsg(sMessage, `\`Usage: ${PREFIX}hypixel player <Player Name> OR ${PREFIX}hypixel guild <Guild name> OR ${PREFIX}hypixel guildmember <Member Name>\``, message);
                if (args[1].toLowerCase() === 'player') {
                    if (!args[2]) return client.editMsg(sMessage, "You have to put a player name!", message);
                    client.hypixel.getPlayer('name', args[2]).then(player => {
                        let embed = new Discord.MessageEmbed()
                            .setTitle(`${player.player.displayname}'s Player Data`)
                            .addField("Known Aliases", player.player.knownAliases, true)
                            .addField("One Time Achievements Completed", player.player.achievementsOneTime.length, true)
                            .addField('Network XP', player.player.networkExp, true)
                            .addField('Karma', player.player.karma, true)
                            .addField('Total Votes', player.player.voting.total, true)
                            .setColor(0x00FFFF)
                            .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL());
                        client.editMsg(sMessage, embed, message);
                    }).catch(() => {
                        client.editMsg(sMessage, "I did not find a player with that name!", message);
                    });
                } else if (args[1].toLowerCase() === 'guild') {
                    if (!args[2]) return client.editMsg(sMessage, "You have to put a guild name!", message);
                    client.hypixel.findGuild('name', args.slice(2).join(' ')).then(async data => {
                        if (data.guild) {
                            let guildData = await client.hypixel.getGuild(data.guild);
                            let embed = new Discord.MessageEmbed()
                                .setTitle(`${guildData.guild.name}'s Guild Info`)
                                .addField("Member Count", guildData.guild.members.length, true)
                                .addField("Description", guildData.guild.description ? guildData.guild.description : "None", true)
                                .addField('Guild XP', guildData.guild.exp, true)
                                .setColor(0x00FFFF)
                                .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL());
                            client.editMsg(sMessage, embed, message);
                        } else {
                            client.editMsg(sMessage, "I could not find a guild with that name!", message);
                        }
                    }).catch(() => {
                        client.editMsg(sMessage, "I did not find a guild with that name!", message);
                    });
                } else if (args[1].toLowerCase() === 'guildmember') {
                    if (!args[2]) return client.editMsg(sMessage, "You have to put a member name!", message);
                    let data = await client.hypixel.findGuild('memberName', args.slice(2).join(' '));
                    if (data.guild) {
                        let guildData = await client.hypixel.getGuild(data.guild);
                        let embed = new Discord.MessageEmbed()
                            .setTitle(`${guildData.guild.name}'s Guild Info`)
                            .addField("Member Count", guildData.guild.members.length, true)
                            .addField("Description", guildData.guild.description ? guildData.guild.description : "None", true)
                            .addField('Guild XP', guildData.guild.exp, true)
                            .setColor(0x00FFFF)
                            .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL());
                        client.editMsg(sMessage, embed, message);
                    } else
                        client.editMsg(sMessage, "I did not find a guild with that name!", message);
                } else
                    client.editMsg(sMessage, "The valid arguments are: `player`, `guild`, `guildmember`.", message);
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
                hypixel(msgToEdit);
            } else {
                hypixel(message);
            }
        } catch (e) {
            let rollbar = new client.Rollbar(client.rollbarKey);
            rollbar.error("Something went wrong in hypixel.js", e);
            console.error(e);
            message.channel.send(`Something went wrong while executing the command: \`${PREFIX}hypixel\`\n\n\`\`\`xl\n${e}\n\`\`\``);
        }
    },
    jyguyOnly: 0,
    category: "misc"
}