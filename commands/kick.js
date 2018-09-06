module.exports = {
    help: "Kicks a Member. (mod.kick Required) `Usage: ?kick <Member Mention or ID> [Reason]`",
    func: async (client, message, args, unknownCommand, mess, sql, Discord, fs, PREFIX, bool) => {
        try {
            async function kickcmd(sMessage) {
                // Checks for the custom permission
                let bool2 = false;
                let i = 0;
                let prom = new Promise(resolve => {
                    message.member.roles.forEach(async role => {
                        let row = (await sql.query('SELECT * FROM permissions WHERE roleID = $1 AND pName = $2 AND pCategory = $3', [role.id, "kick", "mod"])).rows[0];
                        if ((row && row.bool) || message.member === message.guild.owner)
                            bool2 = true;
                        i++;
                        if (i === message.member.roles.size)
                            setTimeout(resolve, 10);
                    });
                });
                await prom;
                if (!bool2) return client.editMsg(sMessage, ":x:, Sorry, but you do not have the `mod.kick` permission.", message);
                if (!message.guild.me.hasPermission("KICK_MEMBERS")) return client.editMsg(sMessage, "I do not have enough permissions!", message);
                if (!args[1]) return client.editMsg(sMessage, "You have to mention / put an ID of a member for me to kick!", message);
                let selectedMember = message.guild.members.get(args[1] ? args[1].replace(/[<>@&!]/g, "") : null); // Defines selected member as the first member mentioned
                if (!selectedMember) return client.editMsg(sMessage, "I did not find that user!", message); // If the member is not found with the ID
                if (selectedMember.user === client.bot.user) return client.editMsg(sMessage, 'I cannot kick myself!', message);
                if (!selectedMember.kickable) return client.editMsg(sMessage, "I cannot kick that user. Check my role position!", message); // If the member is not kickable then return and send a message
                if (selectedMember.roles.highest.position >= message.member.roles.highest.position && message.member !== message.guild.owner) return client.editMsg(sMessage, "You do not have enough permissions! (Role position not high enough)", message);
                let optionalReason = args.slice(2).join(" "); // Defines optionalReason as the content after the mention
                if (optionalReason.length > 512) return client.editMsg(sMessage, "Please make the reason under 513 letters.", message);
                if (optionalReason)
                    selectedMember.kick(optionalReason); // If there is a reason then kick with the reason
                else
                    selectedMember.kick(); // If there is not a reason then kick without a reason
                client.editMsg(sMessage, `:ok:, Kicked ${selectedMember.user.tag} (${selectedMember.id}).`, message); // Sends a message to indicate the kick was successful
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
                kickcmd(msgToEdit);
            } else {
                kickcmd(message);
            }
        } catch (e) {
            let rollbar = new client.Rollbar(client.rollbarKey);
            rollbar.error("Something went wrong in kick.js", e);
            console.error(e);
            message.channel.send(`Something went wrong while executing the command: \`${PREFIX}kick\`\n\n\`\`\`xl\n${e}\n\`\`\``);
        }
    },
    jyguyOnly: 0,
    category: "moderation"
}
