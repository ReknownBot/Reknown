module.exports = {
    help: "Displays the uptime of the bot.",
    func: async (client, message, args, unknownCommand, mess, sql, Discord, fs, PREFIX, bool) => {
            try {
                async function uptimeCmd(sMessage) {
                    let seconds = Math.floor((client.bot.uptime / 1000) % 60);
                    let minutes = Math.floor((client.bot.uptime / 1000 / 60) % 60);
                    let hours = Math.floor((client.bot.uptime / 1000 / 60 / 60) % 24);
                    let days = Math.floor(client.bot.uptime / 1000 / 60 / 60 / 24);

                    client.editMsg(sMessage, `Uptime: **${days} days, ${hours} hours, ${minutes} minutes, and ${seconds} seconds.**`, message);
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
                    uptimeCmd(msgToEdit);
                } else {
                    uptimeCmd(message);
                }
            } catch (e) {
                message.channel.send(`Something went wrong while executing the command: \`${PREFIX}uptime\`\n\n\`\`\`xl\n${e}\n\`\`\``);
                console.error(e);
            }
        },
        jyguyOnly: 0,
        category: "misc"
}