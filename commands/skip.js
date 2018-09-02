module.exports = {
    help: "This command skips a song!",
    func: async (client, message, args, unknownCommand, mess, sql, Discord, fs, PREFIX, bool) => {
            try {
                async function skipcmd(sMessage) {
                    if (!message.guild.me.voice.channel) return client.editMsg(sMessage, "I am not playing anything!", message);
                    if (message.member.voice.channel !== message.guild.me.voice.channel) return client.editMsg(sMessage, "You have to be in the same voice channel as me!", message);
                    if (client.guilds[message.guild.id].queue.length < 1) return client.editMsg(sMessage, "I am not playing anything!", message);
                    if (client.guilds[message.guild.id].skippers.indexOf(message.author.id) === -1) {
                        client.guilds[message.guild.id].skippers.push(message.author.id);
                        client.guilds[message.guild.id].skipReq++;
                        if (client.guilds[message.guild.id].skipReq >= Math.ceil((client.guilds[message.guild.id].voiceChannel.members.size - 1) / 2)) {
                            client.skip_song(message);
                            message.reply(" Your skip has been acknowledged. Skipping the song now!");
                            client.guilds[message.guild.id].skippers = [];
                            client.guilds[message.guild.id].skipReq = 0;
                        } else {
                            message.reply(` Your skip has been acknowledged. You need **${Math.ceil((client.guilds[message.guild.id].voiceChannel.members.size - 1) / 2) - guilds[message.guild.id].skipReq}** more skips!`);
                        }
                    } else {
                        msg = await message.reply(" You already voted to skip this song!");
                        client.msgEdit[message.id] = msg.id;
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
                    skipcmd(msgToEdit);
                } else {
                    skipcmd(message);
                }
            } catch (e) {
                message.channel.send(`Something went wrong while executing the command: \`${PREFIX}skip\`\n\n\`\`\`xl\n${e}\n\`\`\``);
                console.error(e);
            }
        },
        jyguyOnly: 0,
        category: "fun"
}