module.exports = {
    help: "Sends a pong!",
    func: async (client, message, args, unknownCommand, mess, sql, Discord, fs, PREFIX, bool) => {
            try {
                async function pingcmd(sMessage) {
                    const pping = Math.round(client.bot.ping);
                    client.editMsg(sMessage, `:stopwatch: Pong! Heartbeat ping: \`${pping}\`ms`, message);
                }

                if (bool) {
                    args = message.content.slice(PREFIX.length).split(' ');
                    for (let i = args.length - 1; i--;)
                    if (args[i] == '')
                        args.splice(i, 1);
                    let msgToEdit;
                    msgToEdit = await message.channel.messages.fetch(client.msgEdit[message.id]);
                    pingcmd(msgToEdit);
                } else {
                    pingcmd(message);
                }
            } catch (e) {
                let rollbar = new client.Rollbar(client.rollbarKey);
                rollbar.error("Something went wrong in ping.js", e);
                console.error;
                message.channel.send(`Something went wrong while executing the command: \`${PREFIX}ping\`\n\n\`\`\`xl\n${e}\n\`\`\``);
            }
        },
        jyguyOnly: 0,
        category: "misc"
}