module.exports = {
    help: "Renames a text channel! `Usage: ?rename <Channel> <New Name>`",
    func: async (client, message, args, unknownCommand, mess, sql, Discord, fs, PREFIX, bool) => {
        try {
            async function renamecmd(sMessage) {
                if (!message.member.hasPermission("MANAGE_CHANNELS")) return client.editMsg(sMessage, "You do not have sufficient permissions!", message);
                if (!message.guild.me.hasPermission("MANAGE_CHANNELS")) return client.editMsg(sMessage, "I do not have sufficient permissions!", message);
                if (!args[1]) return client.editMsg(sMessage, "You need to mention a channel & a new name!\n\n`Eg. ?renamechannel #discuss main`", message);
                let x = message.guild.channels.get(args[1] ? args[1].replace(/[<>#]/g, "") : null);
                if (!x) return client.editMsg(sMessage, "That channel doesn't exist! Mention one to rename it!\n\n`Eg. ?renamechannel #discuss main`", message);
                if (!x.permissionsFor(message.guild.me).has("MANAGE_CHANNELS")) return client.editMsg(sMessage, "I do not have enough permissions!", message);
                let y = args.slice(2).join(" ");
                if (!y) return client.editMsg(sMessage, "You need to type in a new name!\n\n`Eg. ?renamechannel #discuss main`", message);
                if (y.length < 2 || y.length > 101) return client.editMsg(sMessage, "The new name has to be more than 1 letter and less than 101 letters!", message);
                if (y.includes(" ")) return client.editMsg(sMessage, "You cannot have spaces in the names, use dashes or underscores!", message);
                x.setName(y);
                client.editMsg(sMessage, `Successfully changed ${x} to ${y}.`, message);
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
                renamecmd(msgToEdit);
            } else {
                renamecmd(message);
            }
        } catch (e) {
            let rollbar = new client.Rollbar(client.rollbarKey);
            rollbar.error("Something went wrong in rename.js", e);
            console.error(e);
            message.channel.send(`Something went wrong while executing the command: \`${PREFIX}rename\`\n\n\`\`\`xl\n${e}\n\`\`\``);
        }
    },
    jyguyOnly: 0,
    category: "misc"
}