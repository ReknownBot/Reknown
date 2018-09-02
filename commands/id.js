module.exports = {
    help: "This gives the ID of a member! `Usage: ?id [Member]`",
    func: async (client, message, args, unknownCommand, mess, sql, Discord, fs, PREFIX, bool) => {
        try {
            async function idcmd(sMessage) {
                let selectedMember = message.guild.members.get(args[1] ? args[1].replace(/[<>@&!]/g, "") : null);
                let selectedID;
                let thingy;
                if (!selectedMember) {
                    selectedID = message.member.id;
                    thingy = "Your"
                } else {
                    thingy = `${selectedMember.user.tag}`;
                    selectedID = selectedMember.id;
                }
                client.editMsg(sMessage, `${thingy} ID: ${selectedID}`, message);
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
                idcmd(msgToEdit);
            } else {
                idcmd(message);
            }
        } catch (e) {
            let rollbar = new client.Rollbar(client.rollbarKey);
            rollbar.error("Something went wrong in id.js", e);
            console.error(e);
            message.channel.send(`Something went wrong while executing the command: \`${PREFIX}id\`\n\n\`\`\`xl\n${e}\n\`\`\``);
        }
    },
    jyguyOnly: 0,
    category: "misc"
}