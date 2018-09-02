module.exports = {
    help: "Use this command to start a poll with reactions! (Manage Messages permission required) `Usage: ?poll <Yes/No Question>`",
    func: async (client, message, args, unknownCommand, mess, sql, Discord, fs, PREFIX, bool) => {
        try {
            async function pollcmd(sMessage) {
                if (!message.channel.permissionsFor(message.member).has("MANAGE_MESSAGES")) return client.editMsg(sMessage, "You do not have enough permissions!", message);
                if (!args[1]) return client.editMsg(sMessage, "You need to put in a yes or no question!", message);
                await message.react("👍");
                message.react("👎");
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
                pollcmd(msgToEdit);
            } else {
                pollcmd(message);
            }
        } catch (e) {
            let rollbar = new client.Rollbar(client.rollbarKey);
            rollbar.error("Something went wrong in poll.js", e);
            console.error(e);
            message.channel.send(`Something went wrong while executing the command: \`${PREFIX}poll\`\n\n\`\`\`xl\n${e}\n\`\`\``);
        }
    },
    jyguyOnly: 0,
    category: "fun"
}