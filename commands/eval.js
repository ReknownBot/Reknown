module.exports = {
    help: "Evaluates code. `Usage: ?eval <Code>`",
    func: async (client, message, args, unknownCommand, mess, sql, Discord, fs, PREFIX, bool) => {
        async function eval2(sMessage) {
            if (message.author.id !== "288831103895076867") {
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

            function clean(text) {
                if (typeof (text) === "string")
                    return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
                else
                    return text;
            }

            if (!args[1]) return client.editMsg(sMessage, 'You have to provide code for me to evaluate!', message);

            try {
                const code = args.slice(1).join(" ");
                let evaled = await eval(code);

                if (typeof evaled !== "string")
                    evaled = require("util").inspect(evaled);

                let embed = new Discord.MessageEmbed()
                    .setAuthor("Evaluation")
                    .setTitle("Output")
                    .setDescription(`\`\`\`xl\n${clean(evaled).length <= 1024 ? clean(evaled) : "Over 1024 Characters"}\n\`\`\``)
                    .setColor(0x00FFFF)
                    .setTimestamp();
                client.editMsg(sMessage, embed, message);
            } catch (err) {
                client.editMsg(sMessage, `\`ERROR\` \`\`\`xl\n${clean(err)}\n\`\`\``, message);
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
            eval2(msgToEdit);
        } else {
            eval2(message);
        }
    },
    jyguyOnly: 1,
    category: "misc"
}