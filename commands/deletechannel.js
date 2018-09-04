module.exports = {
    help: "Deletes a mentioned channel. (Manage Channels permission required) `Usage: ?deletechannel <Channel>`",
    func: async (client, message, args, unknownCommand, mess, sql, Discord, fs, PREFIX, bool) => {
        try {
            async function deletechannel(sMessage) {
                // Checks for the custom permission
                let bool2 = false;
                let i = 0;
                let prom = new Promise(resolve => {
                    message.member.roles.forEach(async role => {
                        let row = (await sql.query(`SELECT * FROM permissions WHERE roleID = '${role.id}' AND pName = 'cdelete' AND pCategory = 'mod'`)).rows[0];
                        if ((row && row.bool) || message.member === message.guild.owner)
                            bool2 = true;
                        i++;
                        if (i === message.member.roles.size)
                            setTimeout(resolve, 10);
                    });
                });
                await prom;
                if (!bool2) return client.editMsg(sMessage, ":x:, Sorry, but you do not have the `mod.cdelete` permission.", message);
                let channel = message.guild.channels.get(args[1] ? args[1].replace(/[<>#]/g, "") : null);
                if (!channel) return message.channel.send("That is not a channel!");
                if (!message.guild.me.permissionsIn(channel).has("MANAGE_CHANNELS")) return client.editMsg(sMessage, "I do not have enough permissions to do that!", message);
                channel.delete();
                if (channel.id !== message.channel.id) {
                    client.editMsg(sMessage, "Deleted " + channel.name + ".", message);
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
                deletechannel(msgToEdit);
            } else {
                deletechannel(message);
            }
        } catch (e) {
            let rollbar = new client.Rollbar(client.rollbarKey);
            rollbar.error("Something went wrong in deletechannel.js", e);
            message.channel.send(`Something went wrong while executing the command: \`${PREFIX}deletechannel\`\n\n\`\`\`xl\n${e}\n\`\`\``);
            console.error(e);
        }
    },
    jyguyOnly: 0,
    category: "misc"
}