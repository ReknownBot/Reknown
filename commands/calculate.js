function calc(fn) {
    try {
        return new Function('return ' + fn)();
    } catch (e) {
        return false;
    }
}

module.exports = {
    help: "Calculates things! `Usage: ?calculate <Calculation>` **Note: This command uses __Javascript__ Arithmetic operators. You can get a list of them here: <https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Expressions_and_Operators#Arithmetic_operators>",
    func: async (client, message, args, unknownCommand, mess, sql, Discord, fs, PREFIX, bool) => {
            try {
                async function calculate(sMessage) {
                    if (!args[1]) return client.editMsg(sMessage, "You need to put something for me to calculate!", message);
                    let formula = args.slice(1).join(' ');
                    let calculated = calc(formula, client, sMessage, message);
                    if (!calculated || typeof calculated !== "number") return client.editMsg(sMessage, "Something went wrong, maybe a syntax is incorrect? Note that this command uses __Javascript__ Arithmetic operators. You can get a list of them here: <https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Expressions_and_Operators#Arithmetic_operators>", message);
                    client.editMsg(sMessage, `The result from \`${formula}\` is \`${calculated}\`!`, message);
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
                    calculate(msgToEdit);
                } else {
                    calculate(message);
                }
            } catch (e) {
                message.channel.send(`Something went wrong while executing the command: \`${PREFIX}calculate\`\n\n\`\`\`xl\n${e}\n\`\`\``);
                console.error(e);
            }
        },
        jyguyOnly: 0,
        category: "misc"
}