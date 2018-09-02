module.exports = {
    help: "This command makes me say something raw! `Usage: ?sayraw <Content>`",
    func: async (client, message, args, unknownCommand, mess, sql, Discord, fs, PREFIX, bool) => {
        try {
            async function sayrawcmd(sMessage) {
                let selectedMessage = args.slice(1).join(" ");
                if (!selectedMessage) return client.editMsg(sMessage, "You have to include content for me to say!", message);
                if (message.channel.permissionsFor(client.bot.user).has("MANAGE_MESSAGES"))
                    message.delete();
                client.editMsg(sMessage, selectedMessage, message);
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
                sayrawcmd(msgToEdit);
            } else {
                sayrawcmd(message);
            }
        } catch (e) {
            let rollbar = new client.Rollbar(client.rollbarKey);
            rollbar.error("Something went wrong in sayraw.js", e);
            console.error(e);
            message.channel.send(`Something went wrong while executing the command: \`${PREFIX}sayraw\`\n\n\`\`\`xl\n${e}\n\`\`\``);
        }
    },
    jyguyOnly: 0,
    category: "fun"
}