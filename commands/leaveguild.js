module.exports = {
    help: "Makes me leave the server if you're too lazy to kick me! (Manage Server Permission Required)",
    func: async (client, message, args, unknownCommand, mess, sql, Discord, fs, PREFIX, bool) => {
        try {
            async function leaveguild(sMessage) {
                if (!message.member.hasPermission("MANAGE_GUILD")) return client.editMsg(sMessage, "You do not have the \"Manage Server\" permission!", message);
                message.channel.send("Do you really want me to leave the server? Please type `yes` or `no`.");
                let msgC = await message.channel.awaitMessages(m => m.author.id === message.author.id, {
                    time: 10000,
                    max: 1
                });
                let response = msgC.first().content.trim().toLowerCase();
                let arr = [
                    "yes",
                    "no"
                ];
                if (!arr.includes(response)) return message.channel.send("That is not a yes or no!");
                if (response === "yes") { // Yes
                    await message.channel.send("Leaving Server.");
                    message.guild.leave();
                } else { // No
                    client.editMsg(sMessage, ":ok_hand:, I'll stay.", message);
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
                leaveguild(msgToEdit);
            } else {
                leaveguild(message);
            }
        } catch (e) {
            let rollbar = new client.Rollbar(client.rollbarKey);
            rollbar.error("Something went wrong in leaveguild.js", e);
            console.error(e);
            message.channel.send(`Something went wrong while executing the command: \`${PREFIX}leaveguild\`\n\n\`\`\`xl\n${e}\n\`\`\``);
        }
    },
    jyguyOnly: 0,
    category: "misc"
}