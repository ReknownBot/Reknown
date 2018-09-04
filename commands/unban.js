module.exports = {
    help: "Unbans a user. (mod.unban Required) `Usage: ?unban <Member ID>`",
    func: async (client, message, args, unknownCommand, mess, sql, Discord, fs, PREFIX, bool) => {
            try {
                async function unbancmd(sMessage) {
                    // Checks for the custom permission
                    let bool2 = false;
                    let i = 0;
                    let prom = new Promise(resolve => {
                        message.member.roles.forEach(async role => {
                            let row = (await sql.query('SELECT * FROM permissions WHERE roleID = $1 AND pName = $2 AND pCategory = $3', [role.id, "unban", "mod"])).rows[0];
                            if ((row && row.bool) || message.member === message.guild.owner)
                                bool2 = true;
                            i++;
                            if (i === message.member.roles.size)
                                setTimeout(resolve, 10);
                        });
                    });
                    await prom;
                    if (!bool2) return client.editMsg(sMessage, ":x:, Sorry, but you do not have the `mod.unban` permission.", message);
                    let selectedID = args[1];
                    if (!selectedID) return client.editMsg(sMessage, "Please provide an ID for me to unban!", message);
                    if (!parseInt(args[1])) return client.editMsg(sMessage, "Please provide a valid ID for me to unban.", message);
                    if (!message.guild.me.hasPermission("BAN_MEMBERS")) return client.editMsg(sMessage, "I do not have permissions!", message);
                    let bans = await message.guild.fetchBans();
                    if (!bans.has(selectedID)) return client.editMsg(sMessage, "I did not find any bans for that ID!", message);
                    else {
                        let reason = args.slice(2).join(' ');
                        message.guild.members.unban(selectedID, reason)
                            .then(user => {
                                client.editMsg(sMessage, `Successfully unbanned ${user.tag} for ${reason ? reason : "None"}.`, message);
                            }).catch(error => {
                                console.log(error);
                                let rollbar = new client.Rollbar(client.rollbarKey);
                                rollbar.error("Something went wrong in unban.js", e);
                                message.channel.send(`Something went wrong, I have already reported this to Jyguy. I'll let you know in my support server if this is fixed.`);
                            });
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
                    unbancmd(msgToEdit);
                } else {
                    unbancmd(message);
                }
            } catch (e) {
                let rollbar = new client.Rollbar(client.rollbarKey);
                rollbar.error("Something went wrong in unban.js", e);
                console.error(e);
                message.channel.send(`Something went wrong while executing the command: \`${PREFIX}unban\`\n\n\`\`\`xl\n${e}\n\`\`\``);
            }
        },
        jyguyOnly: 0,
        category: "moderation"
}