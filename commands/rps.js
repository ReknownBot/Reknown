module.exports = {
    help: "Play rock paper scissors with the bot! `Usage: ?rps <Choice>`",
    func: async (client, message, args, unknownCommand, mess, sql, Discord, fs, PREFIX, bool) => {
            try {
                async function rpscmd(sMessage) {
                    if (!args[1]) return message.channel.send("You need to put valid args! `rock, paper, or scissors`");
                    let options = [
                        "scissors",
                        "rock",
                        "paper"
                    ];
                    let options2 = [
                        "s",
                        "r",
                        "p"
                    ];
                    if (!options.includes(args[1].toLowerCase()) && !options2.includes(args[1].toLowerCase())) return message.channel.send("That is not one of the options!");
                    let botOption = client.randFromArr(options);
                    message.channel.send(`I choose **${botOption}**!`);
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
                    rpscmd(msgToEdit);
                } else {
                    rpscmd(message);
                }
            } catch (e) {
                message.channel.send(`Something went wrong while executing the command: \`${PREFIX}rps\`\n\n\`\`\`xl\n${e}\n\`\`\``);
                console.error(e);
            }
        },
        jyguyOnly: 0,
        category: "fun"
}