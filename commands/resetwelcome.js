module.exports = {
    help: "Resets the welcome message (misc.welcome Required)",
    func: async (client, message, args, unknownCommand, mess, sql, Discord, fs, PREFIX, bool) => {
        try {
            async function resetwelcomecmd(sMessage) {
                // Checks for the custom permission
                let bool2 = false;
                let i = 0;
                let prom = new Promise(resolve => {
                    message.member.roles.forEach(async role => {
                        let row = await sql.get('SELECT * FROM permissions WHERE roleID = ? AND pName = ? AND pCategory = ?', [role.id, "welcome", "misc"]);
                        if ((row && row.bool) || message.member === message.guild.owner)
                            bool2 = true;
                        i++;
                        if (i === message.member.roles.size)
                            setTimeout(resolve, 10);
                    });
                });
                await prom;
                if (!bool2) return client.editMsg(sMessage, ":x:, Sorry, but you do not have the `misc.welcome` permission.", message);
                let r = await sql.get(`SELECT * FROM customMessages WHERE guildId = ${message.guild.id}`);
                if (!r) {
                    client.editMsg(sMessage, 'You do not have a custom welcoming message!', message);
                } else {
                    sql.run('DELETE FROM customMessages WHERE guildId = ?', [message.guild.id]);
                    client.editMsg(sMessage, "Successfully reset the welcoming message.", message);
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
                resetwelcomecmd(msgToEdit);
            } else {
                resetwelcomecmd(message);
            }
        } catch (e) {
            let rollbar = new client.Rollbar(client.rollbarKey);
            rollbar.error("Something went wrong in resetwelcome.js", e);
            console.error(e);
            message.channel.send(`Something went wrong while executing the command: \`${PREFIX}resetwelcome\`\n\n\`\`\`xl\n${e}\n\`\`\``);
        }
    },
    jyguyOnly: 0,
    category: "misc"
}