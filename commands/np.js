module.exports = {
    help: "Shows what the bot is playing on music.",
    func: async (client, message, args, unknownCommand, mess, sql, Discord, fs, PREFIX, bool) => {
            try {
                async function npcmd(sMessage) {
                    if (!client.guilds[message.guild.id].isPlaying || !message.guild.me.voice.channel) return client.editMsg(sMessage, "I am not playing anything!", message);
                    if (message.guild.me.voice.channel !== message.member.voice.channel) return client.editMsg(sMessage, "You have to be in the same voice channel as me!", message);
                    let queue = client.guilds[message.guild.id].queueNames;
                    if (!queue[0]) return client.editMsg(sMessage, "I am not playing anything!", message);
                    client.editMsg(sMessage, `**Now Playing:** \`${queue[0]}\``, message);
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
                    npcmd(msgToEdit);
                } else {
                    npcmd(message);
                }
            } catch (e) {
                message.channel.send(`Something went wrong while executing the command: \`${PREFIX}np\`\n\n\`\`\`xl\n${e}\n\`\`\``);
                console.error(e);
            }
        },
        jyguyOnly: 0,
        category: "fun"
}