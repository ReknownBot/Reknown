module.exports = {
    help: "Sets the guild name! (Manage Guild permission required) `Usage: ?guildname <New Name>`",
    func: async (client, message, args, unknownCommand, mess, sql, Discord, fs, PREFIX, bool) => {
        try {
            async function guildname(sMessage) {
                if (!message.member.hasPermission("MANAGE_GUILD")) return client.editMsg(sMessage, "You do not have enough permissions! (Manage Guild)", message);
                if (!message.guild.me.hasPermission("MANAGE_GUILD")) return client.editMsg(sMessage, "I do not have enough permissions!", message);
                if (!args[1]) return client.editMsg(sMessage, "You need to type in a new name!", message);
                let guildname = args.slice(1).join(" ");
                if (guildname === message.guild.name) return client.editMsg(sMessage, "The guild name is the same of what you typed!", message);
                if (guildname.length > 100) return client.editMsg(sMessage, "The new name has to be less than 101!");
                if (guildname.length < 2) return client.editMsg(sMessage, "The new name has to be bigger than 1!");
                message.guild.setName(guildname);
                client.editMsg(sMessage, "The name has been successfully changed to " + guildname + ".", message);
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
                guildname(msgToEdit);
            } else {
                guildname(message);
            }
        } catch (e) {
            let rollbar = new client.Rollbar(client.rollbarKey);
            rollbar.error("Something went wrong in guildname.js", e);
            console.error(e);
            message.channel.send(`Something went wrong while executing the command: \`${PREFIX}guildname\`\n\n\`\`\`xl\n${e}\n\`\`\``);
        }
    },
    jyguyOnly: 0,
    category: "misc"
}