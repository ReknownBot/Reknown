module.exports = {
    help: "Reloads a specific command. (Bot Owner Only) `Usage: ?reload [Command Name]`",
    func: async (client, message, args, unknownCommand, mess, sql, Discord, fs, PREFIX, bool) => {
        try {
            async function reloadcmd(sMessage) {
                if (message.member.id !== "288831103895076867") {
                    let arr = [];
                    client.commandsList.forEach(command => {
                        let rawcommand = command.slice(0, command.length - 3);
                        let item = client.commands[rawcommand];
                        let guildID = message.guild.id;
                        // If the message author ID is Jyguy, add it to the list regardless of guilds
                        if (message.author.id === '288831103895076867') {
                            arr.push(`${rawcommand} ${client.fuzz.ratio(rawcommand, args[0])}`);
                            // From now on the member will be 100% not jyguy
                        } else if (!item.jyguyOnly)
                            arr.push(`${rawcommand} ${client.fuzz.ratio(rawcommand, args[0])}`);
                    });
                    let arr2 = arr.sort((a, b) => {
                        return b.split(' ')[1] - a.split(' ')[1];
                    });
                    client.editMsg(sMessage, `Could not find the command. Did you mean \`${arr2[0].split(' ')[0]}, ${arr2[1].split(' ')[0]}, or ${arr2[2].split(' ')[0]}\`?`, message);
                    return;
                }
                if (args.length > 1) client.load(args[1], message, sMessage);
                else client.load(null, message, sMessage);
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
                reloadcmd(msgToEdit);
            } else {
                reloadcmd(message);
            }
        } catch (e) {
            let rollbar = new client.Rollbar(client.rollbarKey);
            rollbar.error("Something went wrong in reload.js", e);
            message.channel.send(`Something went wrong while executing the command: \`${PREFIX}reload\`\n\n\`\`\`xl\n${e}\n\`\`\``);
            console.error(e);
        }
    },
    jyguyOnly: 1,
    category: "misc"
}