module.exports = {
    help: "This command resets the nick of a user! (mod.nick permission required) `Usage: ?resetnick [Member]`",
    func: async (client, message, args, unknownCommand, mess, sql, Discord, fs, PREFIX, bool) => {
        try {
            async function resetnickcmd(sMessage) {
                // Checks for the custom permission
                let bool2 = false;
                let i = 0;
                let prom = new Promise(resolve => {
                    message.member.roles.forEach(async role => {
                        let row = await sql.get('SELECT * FROM permissions WHERE roleID = ? AND pName = ? AND pCategory = ?', [role.id, "nick", "mod"]);
                        if ((row && row.bool) || message.member === message.guild.owner)
                            bool2 = true;
                        i++;
                        if (i === message.member.roles.size)
                            setTimeout(resolve, 10);
                    });
                });
                await prom;
                if (!bool2) return client.editMsg(sMessage, ":x:, Sorry, but you do not have the `mod.nick` permission.", message);
                if (!message.guild.me.hasPermission("MANAGE_NICKNAMES")) return client.editMsg(sMessage, "I do not have enough permissions!", message);
                let member = message.guild.members.get(args[1] ? args[1].replace(/[<>@&!]/g, "") : null);
                if (!args[1]) {
                    if (message.member.nickname === '') return client.editMsg(sMessage, "You have no nickname set right now!", message);
                    message.member.setNickname("");
                    client.editMsg("Successfully reset your nickname.");
                } else {
                    if (!member) return client.editMsg("Invalid user. Mention someone to reset their nick!");
                    if (member.roles.highest.position >= message.guild.me.roles.highest.position) return client.editMsg(sMessage, "My role position is not high enough!", message);
                    if (member === message.guild.owner) return client.editMsg(sMessage, "I cannot reset the owner's nickname!", message);
                    if (member.roles.highest.position >= message.member.roles.highest.position && message.member !== message.guild.owner) return client.editMsg(sMessage, "Your role position is not high enough!", message);
                    await member.setNickname("");
                    client.editMsg(sMessage, `Successfully reset ${member.user.tag}'s nickname.`, message);
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
                resetnickcmd(msgToEdit);
            } else {
                resetnickcmd(message);
            }
        } catch (e) {
            let rollbar = new client.Rollbar(client.rollbarKey);
            rollbar.error("Something went wrong in resetnick.js", e);
            console.error(e);
            message.channel.send(`Something went wrong while executing the command: \`${PREFIX}resetnick\`\n\n\`\`\`xl\n${e}\n\`\`\``);
        }
    },
    jyguyOnly: 0,
    category: "misc"
}