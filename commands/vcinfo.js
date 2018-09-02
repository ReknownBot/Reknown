module.exports = {
    help: "Displays the information for the voice channel you're connected to!",
    func: async (client, message, args, unknownCommand, mess, sql, Discord, fs, PREFIX, bool) => {
            try {
                async function vcinfocmd(sMessage) {
                    if (!message.member.voice.channel) return client.editMsg(sMessage, "You have to be in a voice channel to do this!", message);

                    let a = message.member.voice.channel.members.array();
                    let embed = new Discord.MessageEmbed()
                        .addField("Members in the Voice Channel:", a.length)
                        .addField("Voice Channel Name:", message.member.voice.channel.name)
                        .addField("People in the Voice Channel:", a.list())
                        .setColor(0x00FFFF)
                        .setFooter("Requested by: " + message.author.tag, message.author.displayAvatarURL());

                    client.editMsg(sMessage, embed, message);
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
                    vcinfocmd(msgToEdit);
                } else {
                    vcinfocmd(message);
                }
            } catch (e) {
                let rollbar = new client.Rollbar(client.rollbarKey);
                rollbar.error("Something went wrong in vcinfo.js", e);
                console.error(e);
                message.channel.send(`Something went wrong while executing the command: \`${PREFIX}vcinfo\`\n\n\`\`\`xl\n${e}\n\`\`\``);
            }
        },
        jyguyOnly: 0,
        category: "misc"
}