module.exports = {
    help: "This sets the points of a user! (level.set Required) `Usage: ?setpoints <Member Mention or ID> <Amount>`",
    func: async (client, message, args, unknownCommand, mess, sql, Discord, fs, PREFIX, bool) => {
        try {
            async function setpointscmd(sMessage) {
                // Checks for the custom permission
                let bool2 = false;
                let i = 0;
                let prom = new Promise(resolve => {
                    message.member.roles.forEach(async role => {
                        let row2 = (await sql.query('SELECT * FROM permissions WHERE roleID = $1 AND pName = $2 AND pCategory = $3', [role.id, "set", "level"])).rows[0];
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
                    if (!selectedMember) return client.editMsg(sMessage, `Please supply a member for me to set the point with.\n\n\`Eg. ?setpoints ${message.member} 50\``, message);
                    if (selectedMember.roles.highest.position >= message.member.roles.highest.position && message.member !== message.guild.owner) return client.editMsg(sMessage, "Your role position is not high enough!", message);
                    if (!amount) return client.editMsg(sMessage, `Please supply an amount.\n\n\`Eg. ?setpoints ${message.member} 50\``, message);
                    if (isNaN(amount)) return client.editMsg(sMessage, "That is not a number!", message);
                    let row = (await sql.query('SELECT * FROM scores WHERE userID = $1 AND guildID = $2', [message.author.id, message.guild.id])).rows[0];
                    if (!row) {
                        sql.query("INSERT INTO scores (userID, points, level, guildID) VALUES ($1, $2, $3, $4)", [selectedMember.id, amount, Math.floor(0.2 * Math.sqrt(amount)), message.guild.id]);
                    } else {
                        sql.query('UPDATE scores SET points = $1, level = $2 WHERE userID = $3 AND guildID = $4', [amount, Math.floor(0.2 * Math.sqrt(amount)), selectedMember.id, message.guild.id]);
                    }
                    client.editMsg(sMessage, `Successfully changed ${selectedMember.user.tag}'s points to ${amount}, and that resulted in level ${Math.floor(0.2 * Math.sqrt(amount))}!`, message);
                }

                let row = (await sql.query('SELECT * FROM toggleLevel WHERE guildId = $1', [message.guild.id])).rows[0];
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
                setpointscmd(msgToEdit);
            } else {
                setpointscmd(message);
            }
        } catch (e) {
            let rollbar = new client.Rollbar(client.rollbarKey);
            rollbar.error("Something went wrong in setpoints.js", e);
            console.error(e);
            message.channel.send(`Something went wrong while executing the command: \`${PREFIX}setpoints\`\n\n\`\`\`xl\n${e}\n\`\`\``);
        }
    },
    jyguyOnly: 0,
    category: "misc"
}