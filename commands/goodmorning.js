module.exports = {
    help: "Tells everyone you have woken up.",
    func: async (client, message, args, unknownCommand, mess, sql, Discord, fs, PREFIX, bool) => {
        try {
            async function goodmorning(sMessage) {
                client.editMsg(sMessage, `${message.author.tag} has woken up!`, message);
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
                goodmorning(msgToEdit);
            } else {
                goodmorning(message);
            }
        } catch (e) {
            let rollbar = new client.Rollbar(client.rollbarKey);
            rollbar.error("Something went wrong in goodmorning.js", e);
            message.channel.send(`Something went wrong while executing the command: \`${PREFIX}goodmorning\`\n\n\`\`\`xl\n${e}\n\`\`\``);
            console.error(e);
        }
    },
    jyguyOnly: 0,
    category: "misc"
}