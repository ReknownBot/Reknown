module.exports = {
    help: "Sends a random reply from 'Yes' or 'No' `Usage: ?8ball <Yes/No question>`",
    func: async (client, message, args, unknownCommand, mess, sql, Discord, fs, PREFIX, bool) => {
            try {
                async function eightball(sMessage) {
                    let fortunes = [
                        "No",
                        "Yes"
                    ];
                    if (args[1]) {
                        client.editMsg(sMessage, client.randFromArr(fortunes), message);
                    } else {
                        client.editMsg(sMessage, `${message.author}, put more description!`, message);
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
                    eightball(msgToEdit);
                } else {
                    eightball(message);
                }
            } catch (e) {
                let rollbar = new client.Rollbar(client.rollbarKey);
                rollbar.error("Something went wrong in 8ball.js", e);
                console.error(e);
                message.channel.send(`Something went wrong while executing the command: \`${PREFIX}8ball\`\n\n\`\`\`xl\n${e}\n\`\`\``);
            }
    },
    jyguyOnly: 0,
    category: "fun"
}