module.exports = {
    help: "This command sets the level for a user! (level.set permission needed) `Usage: ?setlevel <Member Mention or ID> <Amount>`",
    func: async (client, message, args, unknownCommand, mess, sql, Discord, fs, PREFIX, bool) => {
        try {
            async function setlevelcmd(sMessage) {
                // Checks for the custom permission
                let bool2 = false;
                let i = 0;
                let prom = new Promise(resolve => {
                    message.member.roles.forEach(async role => {
                        let row2 = await sql.get('SELECT * FROM permissions WHERE roleID = ? AND pName = ? AND pCategory = ?', [role.id, "set", "level"]);
                        if ((row2 && row2.bool) || message.member === message.guild.owner)
                            bool2 = true;
                        i++;
                        if (i === message.member.roles.size)
                            setTimeout(resolve, 10);
                    });
                });
                await prom;
                if (!bool2) return client.editMsg(sMessage, ":x:, Sorry, but you do not have the `level.set` permission.", message);
                async function thingy() {
                    let selectedMember = message.guild.members.get(args[1] ? args[1].replace(/[<>@&!]/g, "") : null);
                    let amount = args[2];
                    if (!selectedMember) return client.editMsg(sMessage, `Please supply a member for me to set the level with.\n\n\`Eg. ?setlevel ${message.member} 50\``, message);
                    if (selectedMember.roles.highest.position >= message.member.roles.highest.position && message.member !== message.guild.owner) return message.channel.send("Your role position is not high enough!");
                    if (!amount) return client.editMsg(sMessage, `Please supply an amount.\n\n\`Eg. ?setlevel ${message.member} 50\``, message);
                    if (isNaN(amount)) return client.editMsg(sMessage, "That is not a number!", message);
                    let row = await sql.get('SELECT * FROM scores WHERE userID = ? AND guildID = ?', [message.author.id, message.guild.id]);
                    if (!row) {
                        sql.run("INSERT INTO scores (userID, level, points, guildID) VALUES (?, ?, ?, ?)", [selectedMember.id, amount, Math.pow(amount / 0.2, 2), message.guild.id]);
                    } else {
                        sql.run('UPDATE scores SET level = ?, points = ? WHERE userID = ? AND guildID = ?', [amount, Math.pow(amount / 0.2, 2), selectedMember.id, message.guild.id]);
                    }
                    client.editMsg(sMessage, `Successfully changed ${selectedMember.user.tag}'s level to ${amount}, and that resulted in ${Math.pow(amount / 0.2, 2)} points!`, message);
                }

                let row = await sql.get(`SELECT * FROM toggleLevel WHERE guildId = ${message.guild.id}`);
                if (row && row.bool)
                    thingy();
                else
                    client.editMsg(sMessage, "The levelling system is disabled!", message);
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
                setlevelcmd(msgToEdit);
            } else {
                setlevelcmd(message);
            }
        } catch (e) {
            let rollbar = new client.Rollbar(client.rollbarKey);
            rollbar.error("Something went wrong in setlevel.js", e);
            console.error(e);
            message.channel.send(`Something went wrong while executing the command: \`${PREFIX}setlevel\`\n\n\`\`\`xl\n${e}\n\`\`\``);
        }
    },
    jyguyOnly: 0,
    category: "misc"
}