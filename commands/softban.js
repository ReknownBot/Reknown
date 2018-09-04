module.exports = {
    help: "Softbans a member. (mod.softban Required) `Usage: ?softban <Member Mention or ID> [Reason]`",
    func: async (client, message, args, unknownCommand, mess, sql, Discord, fs, PREFIX, bool) => {
            try {
                async function softbancmd(sMessage) {
                    // Checks for the custom permission
                    let bool2 = false;
                    let i = 0;
                    let prom = new Promise(resolve => {
                        message.member.roles.forEach(async role => {
                            let row = (await sql.query('SELECT * FROM permissions WHERE roleID = $1 AND pName = $2 AND pCategory = $3', [role.id, "softban", "mod"])).rows[0];
                            if ((row && row.bool) || message.member === message.guild.owner)
                                bool2 = true;
                            i++;
                            if (i === message.member.roles.size)
                                setTimeout(resolve, 10);
                        });
                    });
                    await prom;
                    if (!bool2) return client.editMsg(sMessage, ":x:, Sorry, but you do not have the `mod.softban` permission.", message);
                    if (!message.guild.me.hasPermission("BAN_MEMBERS")) return client.editMsg(sMessage, "I do not have enough permissions!", message);
                    let selectedMember = message.guild.members.get(args[1] ? args[1].replace(/[<>@&!]/g, "") : null);
                    if (!selectedMember) return client.editMsg(sMessage, "You have to provide a member for me to softban!", message);
                    if (selectedMember === message.member) return client.editMsg(sMessage, "You cannot softban yourself!", message);
                    if (selectedMember.roles.highest.position >= message.member && message.member !== message.guild.owner) return client.editMsg(sMessage, "Your role position is not sufficient enough!", message);
                    if (selectedMember == message.guild.owner) return client.editMsg(sMessage, "You cannot ban an owner!", message);
                    if (selectedMember.roles.highest.position >= message.guild.me.roles.highest.position) return client.editMsg(sMessage, "My role position is not high enough!", message);

                    let optionalReason = args.slice(2).join(' ');
                    await selectedMember.ban({
                        reason: optionalReason,
                        days: 7
                    });
                    message.channel.send("Awaiting unban...");
                    await message.guild.members.unban(selectedMember.id);
                    client.editMsg(sMessage, `Successfully softbanned ${selectedMember}${optionalReason ? ` for ${optionalReason}.` : "."}`, message);
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
                    softbancmd(msgToEdit);
                } else {
                    softbancmd(message);
                }
            } catch (e) {
                message.channel.send(`Something went wrong while executing the command: \`${PREFIX}softban\`\n\n\`\`\`xl\n${e}\n\`\`\``);
                console.error(e);
            }
        },
        jyguyOnly: 0,
        category: "moderation"
}