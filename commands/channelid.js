module.exports = {
    help: "Displays the channel id! `Usage: ?channelid <Channel>`",
    func: async (client, message, args, unknownCommand, mess, sql, Discord, fs, PREFIX, bool) => {
        try {
            async function channelid(sMessage) {
                let selectedChannel = message.guild.channels.get(args[1] ? args[1].replace(/[<>#]/g, "") : null);
                if (!selectedChannel) return client.editMsg(sMessage, "That channel does not exist. Mention or provide an ID of a channel!\n\n`Eg. ?channelid #discuss`", message);
                client.editMsg(sMessage, "The id for " + selectedChannel.name + " is `" + selectedChannel.id + "`!", message);
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
                channelid(msgToEdit);
            } else {
                channelid(message);
            }
        } catch (e) {
            let rollbar = new client.Rollbar(client.rollbarKey);
            rollbar.error("Something went wrong in channelid.js", e);
            message.channel.send(`Something went wrong while executing the command: \`${PREFIX}channelid\`\n\n\`\`\`xl\n${e}\n\`\`\``);
            console.error(e);
        }
    },
    jyguyOnly: 0,
    category: "misc"
}