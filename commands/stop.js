module.exports = {
    help: "Stops the current song playing.",
    func: async (client, message, args, unknownCommand, mess, sql, Discord, fs, PREFIX, bool) => {
            try {
                async function stopcmd(sMessage) {
                    if (message.member.voice.channel !== message.guild.me.voice.channel && message.guild.me.voice.channel) return client.editMsg(sMessage, "You have to be in the same voice channel as me!", message);
                    let guild = client.guilds[message.guild.id];
                    guild.queue = [];
                    guild.queueNames = [];
                    guild.skipReq = 0;
                    guild.skippers = [];
                    guild.isPlaying = false;
                    guild.volume = 50;
                    guild.dispatcher ? guild.dispatcher.end() : undefined;
                    message.guild.me.voice.channel ? message.guild.me.voice.channel.leave() : undefined;
                    client.editMsg(sMessage, "Successfully stopped the song.", message);
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
                    stopcmd(msgToEdit);
                } else {
                    stopcmd(message);
                }
            } catch (e) {
                message.channel.send(`Something went wrong while executing the command: \`${PREFIX}stop\`\n\n\`\`\`xl\n${e}\n\`\`\``);
                console.error(e);
            }
        },
        jyguyOnly: 0,
        category: "fun"
}