module.exports = {
    help: "This indicates that you are AFK! `Usage: ?afk [Reason]`",
    func: async (client, message, args, unknownCommand, mess, sql, Discord, fs, PREFIX, bool) => {
        try {
            async function afk(sMessage) {
                if (client.isAFK[message.member.id]) return client.editMsg(sMessage, `${message.author}, You are already AFK! Wake up already.`, message);
                let reason = args.slice(1).join(' ');
                client.editMsg(sMessage, `${message.author}, You are now AFK for the reason of: ${reason ? reason : "None"}`, message);
                client.isAFK[message.member.id] = true;
                let collector = message.channel.createMessageCollector(m => m.guild.id === message.guild.id && m.author.id === message.author.id);
                collector.on("collect", collected => {
                    collector.stop();
                    delete client.isAFK[message.member.id];
                    collected.channel.send(":ok:, Welcome back!");
                });
                let collector2 = message.channel.createMessageCollector(msg => msg.guild.id === message.guild.id);
                collector2.on("collect", collected => {
                    if (collected.member === message.member) return collector2.stop();
                    if (collected.mentions.members.first() && !collected.author.bot) {
                        if (collected.mentions.members.has(message.member.id)) message.channel.send(`${message.author.tag} is AFK for the reason of: ${reason ? reason : "None"}`);
                    }
                });
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
                afk(msgToEdit);
            } else {
                afk(message);
            }
        } catch (e) {
            let rollbar = new client.Rollbar(client.rollbarKey);
            rollbar.error("Something went wrong in afk.js", e);
            console.error;
            message.channel.send(`Something went wrong while executing the command: \`${PREFIX}afk\`\n\n\`\`\`xl\n${e}\n\`\`\``);
        }
    },
    jyguyOnly: 0,
    category: "misc"
}