module.exports = {
    help: "Purges the number of messages mentioned. (mod.purge Required)\n\n`Usage: ?purge <Amount> [Member Mention or ID]`",
    func: async (client, message, args, unknownCommand, mess, sql, Discord, fs, PREFIX, bool) => {
        try {
            async function purgecmd(sMessage) {
                // Checks for the custom permission
                let bool2 = false;
                let i = 0;
                let prom = new Promise(resolve => {
                    message.member.roles.forEach(async role => {
                        let row2 = await sql.get('SELECT * FROM permissions WHERE roleID = ? AND pName = ? AND pCategory = ?', [role.id, "purge", "mod"]);
                        if ((row2 && row2.bool) || message.member === message.guild.owner)
                            bool2 = true;
                        i++;
                        if (i === message.member.roles.size)
                            setTimeout(resolve, 10);
                    });
                });
                await prom;
                if (!bool2) return client.editMsg(sMessage, ":x:, Sorry, but you do not have the `mod.purge` permission.", message);
                if (!message.guild.me.permissionsIn(message.channel).has("MANAGE_MESSAGES")) return client.editMsg(sMessage, "I do not have enough permissions!", message);
                if (!args[1]) return client.editMsg(sMessage, "You need to supply an amount!\n\n`Usage: " + PREFIX + "purge <Amount> [Member Mention or ID]`", message);
                let number = args[1];
                if (!parseInt(number)) return client.editMsg(sMessage, "That is not a number!", message);
                if (number >= 100) return client.editMsg(sMessage, "The number has to be less than 100!", message);
                number++;
                setTimeout(async () => {
                    let optionalMember = message.guild.members.get(args[2] ? args[2].replace(/[<>@&!]/g, "") : null);
                    if (!optionalMember) {
                        let m = await message.channel.bulkDelete(number, true);
                        if (m.size === 0) {
                            client.editMsg(sMessage, "No messages were deleted since they were all 14 days old or older, or there were no more messages.", message);
                        } else if (m.size !== number)
                            client.editMsg(sMessage, `${number - m.size} messages were older than 14 days, or there were not messages, so they were not deleted.`, message);
                    } else { // User Specific
                        // Fetches the messages
                        let msgs = await message.channel.messages.fetch({
                            limit: number
                        });
                        // Filters the messages to only one member
                        let messages = msgs.filter(m => m.author.id === optionalMember.id);
                        // Bulk delete the messages
                        let ms = await message.channel.bulkDelete(messages, true);
                        if (ms.size === 0)
                            client.editMsg(sMessage, `No messages were deleted since I did not find any messages from ${optionalMember.user.tag} recently, or they were 14 days or older.`, message);
                        else if (messages.size !== ms.size)
                            client.editMsg(sMessage, `${messages.size - ms.size} messages were older than 14 days, or there were no messages found.`, message);
                    }
                }, 50);
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
                purgecmd(msgToEdit);
            } else {
                purgecmd(message);
            }
        } catch (e) {
            console.error(e);
            message.channel.send(`Something went wrong while executing the command: \`${PREFIX}purge\`\n\n\`\`\`xl\n${e}\n\`\`\``);
        }
    },
    jyguyOnly: 0,
    category: "moderation"
}