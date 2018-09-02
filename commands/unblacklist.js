module.exports = {
    help: "Unblacklists a user. (Manage Guild Permission Required) `Usage: ?unblacklist <Member>`",
    func: async (client, message, args, unknownCommand, mess, sql, Discord, fs, PREFIX, bool) => {
        try {
            async function unblacklistcmd(sMessage) {
                // Checks for the custom permission
                let bool2 = false;
                let i = 0;
                let prom = new Promise(resolve => {
                    message.member.roles.forEach(async role => {
                        let row2 = await sql.get('SELECT * FROM permissions WHERE roleID = ? AND pName = ? AND pCategory = ?', [role.id, "unblacklist", "mod"]);
                        if ((row2 && row2.bool) || message.member === message.guild.owner)
                            bool2 = true;
                        i++;
                        if (i === message.member.roles.size)
                            setTimeout(resolve, 10);
                    });
                });
                await prom;
                if (!bool2) return client.editMsg(sMessage, ":x:, Sorry, but you do not have the `mod.unblacklist` permission.", message);
                let selectedMember = message.guild.members.get(args[1] ? args[1].replace(/[<>@&!]/g, "") : null);
                if (!selectedMember) return client.editMsg(sMessage, "You have to mention or give me the ID of a member for me to unblacklist!", message);

                if (selectedMember === message.member) return client.editMsg(sMessage, "You cannot unblacklist yourself!", message);
                if (selectedMember.roles.highest.position >= message.member.roles.highest.position && message.member !== message.guild.owner && message.member.id !== "288831103895076867") return client.editMsg(sMessage, "You cannot unblacklist members that have the same role or above yours!", message);
                //if (selectedMember.hasPermission("MANAGE_GUILD") && message.member.id !== "288831103895076867") return client.editMsg(sMessage, "You cannot unblacklist admins / mods!");

                let row = await sql.get(`SELECT * FROM blacklist WHERE guildId = ${message.guild.id} AND userId = ${selectedMember.id}`);
                if (row) {
                    sql.run(`DELETE FROM blacklist WHERE guildId = ${message.guild.id} AND userId = ${selectedMember.id}`);
                    client.editMsg(sMessage, `:+1:, Successfully unblacklisted ${selectedMember.user.tag} (${selectedMember.id}) for ${row.reason} that was blacklisted by ${row.by}`, message);
                } else {
                    client.editMsg(sMessage, "That user is not blacklisted!", message);
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
                unblacklistcmd(msgToEdit);
            } else {
                unblacklistcmd(message);
            }
        } catch (e) {
            let rollbar = new client.Rollbar(client.rollbarKey);
            rollbar.error("Something went wrong in unblacklist.js", e);
            message.channel.send(`Something went wrong while executing the command: \`${PREFIX}unblacklist\`\n\n\`\`\`xl\n${e}\n\`\`\``);
            console.error(e);
        }
    },
    jyguyOnly: 0,
    category: "moderation"
}