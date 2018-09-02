module.exports = {
    help: "Creates an invite for the server! (Create Invites permission required)",
    func: async (client, message, args, unknownCommand, mess, sql, Discord, fs, PREFIX, bool) => {
        try {
            async function createinvite(sMessage) {
                if (!message.member.permissionsIn(message.channel).has("CREATE_INSTANT_INVITE")) return client.editMsg(sMessage, "You do not have sufficient permissions!", message);
                message.channel.send("Please send the expiry date in seconds, 0 is forever; the maximum uses, 0 is unlimited; temporary membership, true / false\n\n`Eg. 0 3 false`");
    
                let collector = message.channel.createMessageCollector(m => m.author.id === message.author.id && m.channel.id === message.channel.id, { time: 300000 });
                collector.on('collect', async collected => {
                    collector.stop();
                    let argz = collected.content.split(" ");
                    if (collected.content.length < 1) return message.channel.send("You have to put in a valid message!");
    
                    if (!argz[2]) return message.channel.send("You have to put in 3 arguments!");
    
                    if (isNaN(argz[0]) && argz[0] !== 0 && argz[0] < 0) return message.channel.send("You have to put in a valid time! (0 or positive integer)");
                    let selectedAge = argz[0];
    
                    if (isNaN(argz[1]) && argz[1] !== 0 && argz[1] < 0) return message.channel.send("You have to put in a valid number for the maximum uses!");
                    let selectedUses = argz[1];
    
                    if (argz[2].toLowerCase() !== "true" && argz[2].toLowerCase() !== "false") return message.channel.send("You have to put in true or false for the temporary membership!");
                    else {
                        let selectedTemp = argz[2];
                        let invite = await message.channel.createInvite({
                            temporary: selectedTemp,
                            maxAge: selectedAge,
                            maxUses: selectedUses,
                            unique: true,
                            reason: `${PREFIX}createinvite Command`
                        });
                        message.channel.send(invite.url);
                        collector.stop();
                    }
                });
    
                collector.on('end', collected => {
                    if (collected.size === 0) return message.channel.send("Not enough messages collected in time (5 Minutes), please try again.");
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
                createinvite(msgToEdit);
            } else {
                createinvite(message);
            }
        } catch (e) {
            let rollbar = new client.Rollbar(client.rollbarKey);
            rollbar.error("Something went wrong in createinvite.js", e);
            message.channel.send(`Something went wrong while executing the command: \`${PREFIX}createinvite\`\n\n\`\`\`xl\n${e}\n\`\`\``);
            console.error(e);
        }
    },
    jyguyOnly: 0,
    category: "misc"
}