module.exports = {
    help: "This command displays your level on a server! `Usage: ?level [Member]`",
    func: async (client, message, args, unknownCommand, mess, sql, Discord, fs, PREFIX, bool) => {
            try {
                async function levelcmd(sMessage) {
                    async function thingy() {
                        let optionalMember = message.guild.members.get(args[1] ? args[1].replace(/[<>@&!]/g, "") : null);
                        if (!optionalMember) {
                            let row = (await sql.query('SELECT * FROM scores WHERE userID = $1 AND guildID = $2', [message.author.id, message.guild.id])).rows[0];
                            let embed = new Discord.MessageEmbed()
                                .setTitle(`Your Leveling Info`)
                                .addField("Level", row ? row.level : '0', true)
                                .addField("Points", `${row.points}/${Math.pow((row.level + 1) / 0.2, 2)}`, true)
                                .setColor(0x00FFFF)
                                .setTimestamp()
                                .setThumbnail(message.author.displayAvatarURL())
                                .setFooter(`Requested by ${message.author.tag}`);
                            client.editMsg(sMessage, embed, message);
                        } else {
                            let row = (await sql.query('SELECT * FROM scores WHERE userID = $1 AND guildID = $2', [optionalMember.id, message.guild.id])).rows[0];
                            let embed = new Discord.MessageEmbed()
                                .setTitle(`${optionalMember.user.tag}'s Leveling Info`)
                                .addField("Level", row ? row.level : "0", true)
                                .addField("Points", `${row.points}/${Math.pow((row.level + 1) / 0.2, 2)}`, true)
                                .setColor(0x00FFFF)
                                .setTimestamp()
                                .setThumbnail(optionalMember.user.displayAvatarURL())
                                .setFooter(`Requested by ${message.author.tag}`);
                            client.editMsg(sMessage, embed, message);
                        }
                    }

                    let row = (await sql.query('SELECT * FROM toggleLevel WHERE guildId = $1', [message.guild.id])).rows[0];
                    if (row && row.bool) {
                        thingy();
                    } else {
                        client.editMsg(sMessage, "The levelling system is disabled!", message);
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
                    levelcmd(msgToEdit);
                } else {
                    levelcmd(message);
                }
            } catch (e) {
                let rollbar = new client.Rollbar(client.rollbarKey);
                rollbar.error("Something went wrong in level.js", e);
                console.error(e);
                message.channel.send(`Something went wrong while executing the command: \`${PREFIX}level\`\n\n\`\`\`xl\n${e}\n\`\`\``);
            }
        },
        jyguyOnly: 0,
        category: "fun"
}