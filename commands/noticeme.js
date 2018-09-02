module.exports = {
    help: "The bot notices you.",
    func: async (client, message, args, unknownCommand, mess, sql, Discord, fs, PREFIX, bool) => {
        try {
            async function noticeme(sMessage) {
               client.editMsg(sMessage, `${message.author}, #noticed :eyes:`, message); 
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
                noticeme(msgToEdit);
            } else {
                noticeme(message);
            }
        } catch (e) {
            let rollbar = new client.Rollbar(client.rollbarKey);
            rollbar.error("Something went wrong in noticeme.js", e);
            console.error(e);
            message.channel.send(`Something went wrong while executing the command: \`${PREFIX}noticeme\`\n\n\`\`\`xl\n${e}\n\`\`\``);
        }
    },
    jyguyOnly: 0,
    category: "fun"
}