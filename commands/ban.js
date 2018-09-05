module.exports = {
    help: "This command bans a member with or without a reason! (mod.ban Required) `Usage: ?ban <Member> [Reason]`",
    func: async (client, message, args, unknownCommand, mess, sql, Discord, fs, PREFIX, bool) => {
            try {
                async function bancmd(sMessage) {
                    // Checks for the custom permission
                    let bool2 = false;
                    let i = 0;
                    let prom = new Promise(resolve => {
                        message.member.roles.forEach(async role => {
                            let row = (await sql.query(`SELECT * FROM permissions WHERE roleID = '${role.id}' AND pName = 'ban' AND pCategory = 'mod'`)).rows[0];
                            if ((row && row.bool) || message.member === message.guild.owner)
                                bool2 = true;
                            i++;
                            if (i === message.member.roles.size) {
                                setTimeout(resolve, 10);
                            }
                        });
                    });
                    await prom;
                    if (!bool2) return client.editMsg(sMessage, ":x:, Sorry, but you do not have the `mod.ban` permission.", message);

                    if (!message.guild.me.hasPermission("BAN_MEMBERS")) return client.editMsg(sMessage, "I do not have enough permissions!", message);
                    if (!args[1]) return client.editMsg(sMessage, "You have to mention / provide an ID of a user!", message);
                    let selectedMember;
                    try {
                        selectedMember = message.guild.members.get(args[1] ? args[1].replace(/[<>@&!]/g, "") : null) || await client.bot.users.fetch(args[1] ? args[1].replace(/[<>@&!]/g, "") : null);
                        if (!selectedMember) return client.editMsg(sMessage, "Please provide a valid mention or an ID of a user.", message);
                        if (selectedMember === message.member) return client.editMsg(sMessage, "You cannot ban yourself!", message);
                        if (selectedMember.user ? selectedMember.user : selectedMember === client.bot.user) return client.editMsg(sMessage, "I cannot ban myself!", message);
                        if (selectedMember.user) { // If it's a member
                            if (selectedMember.roles.highest.position >= message.member.roles.highest.position && message.guild.owner !== message.member) return client.editMsg(sMessage, "You cannot ban that member! (Insufficient Role Position)", message);
                        }
                        let b = await message.guild.fetchBans();
                        if (b.has(selectedMember.id)) return client.editMsg(sMessage, "That user was already banned!", message);

                        let reason = args[2] ? " for " + args.slice(2).join(' ') : "";

                        message.guild.members.ban(selectedMember, {
                            reason: reason.slice(4)
                        }).then(() => {
                            client.editMsg(sMessage, `Successfully banned ${selectedMember.user ? selectedMember.user.tag : selectedMember.tag}${reason}.`, message);
                        }).catch((e) => {
                            if (e == "DiscordAPIError: Missing Permissions")
                                client.editMsg(sMessage, "I cannot ban that member! (Owner or role position)", message);
                            else if (e == "DiscordAPIError: Unknown User")
                                client.editMsg(sMessage, "That member does not exist!", message);
                            else {
                                client.editMsg(sMessage, "Something went wrong, consider joining our support server for updates.", message);
                                let rollbar = new client.Rollbar(client.rollbarKey);
                                rollbar.error("Something went wrong in ban.js", e);
                                console.log(e);
                            }
                        });
                    } catch (e) {
                        if (!e.toString().includes('DiscordAPIError: Invalid Form Body')) {
                            console.log(e);
                            client.editMsg(sMessage, `Something went wrong while executing the command: \`${PREFIX}ban\`\n\n\`\`\`xl\n${e}\n\`\`\``, message);
                        } else {
                            client.editMsg(sMessage, "That user does not exist!", message);
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
                    bancmd(msgToEdit);
                } else {
                    bancmd(message);
                }
            } catch (e) {
                let rollbar = new client.Rollbar(client.rollbarKey);
                rollbar.error("Something went wrong in ban.js", e);
                console.error;
                message.channel.send(`Something went wrong while executing the command: \`${PREFIX}ban\`\n\n\`\`\`xl\n${e}\n\`\`\``);
            }
        },
        jyguyOnly: 0,
        category: "moderation"
}
