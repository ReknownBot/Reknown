module.exports = {
    help: "Either displays or sets the volume for music! `Usage: ?volume <New Volume>`",
    func: async (client, message, args, unknownCommand, mess, sql, Discord, fs, PREFIX, bool) => {
            try {
                async function volumecmd(sMessage) {
                    if (client.guilds[message.guild.id].isPlaying !== true || !message.guild.me.voice.channel) return client.editMsg(sMessage, "I am not playing anything right now!", message);
                    if (message.member.voice.channel !== message.guild.me.voice.channel) return client.editMsg(sMessage, "You have to be in the same voice channel as me!", message);
                    if (!args[1]) return client.editMsg(sMessage, `The volume is: **${client.guilds[message.guild.id].volume}**`, message);
                    let number = parseInt(args[1]);
                    if (!number) return client.editMsg(sMessage, "The value has to be a number!", message);
                    if (number > 500 || number < 1) return client.editMsg(sMessage, "The value has to be in between 1 and 500!", message);
                    let connection = message.guild.me.voice.channel.connection;
                    connection.dispatcher.setVolumeLogarithmic(number / 180);
                    client.guilds[message.guild.id].volume = number;
                    client.editMsg(sMessage, `Successfully changed the volume to **${number}**.`, message);
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
                    volumecmd(msgToEdit);
                } else {
                    volumecmd(message);
                }
            } catch (e) {
                message.channel.send(`Something went wrong while executing the command: \`${PREFIX}volume\`\n\n\`\`\`xl\n${e}\n\`\`\``);
                console.error(e);
            }
        },
        jyguyOnly: 0,
        category: "fun"
}