module.exports = {
    help: "Resumes the song paused by ?pause. (music.resume Required)",
    func: async (client, message, args, unknownCommand, mess, sql, Discord, fs, PREFIX, bool) => {
            try {
                async function resumecmd(sMessage) {
                    // Checks for the custom permission
                    let bool2 = false;
                    let i = 0;
                    let prom = new Promise(resolve => {
                        message.member.roles.forEach(async role => {
                            let row = (await sql.query('SELECT * FROM permissions WHERE roleID = $1 AND pName = $2 AND pCategory = $3', [role.id, "resume", "music"])).rows[0];
                            if ((row && row.bool) || message.member === message.guild.owner)
                                bool2 = true;
                            i++;
                            if (i === message.member.roles.size)
                                setTimeout(resolve, 10);
                        });
                    });
                    await prom;
                    if (!bool2) return client.editMsg(sMessage, ":x:, Sorry, but you do not have the `music.resume` permission.", message);
                    if (!message.guild.me.voice.channel || client.guilds[message.guild.id].queueNames.length === 0) return client.editMsg(sMessage, "I am not playing anything!", message);
                    if (client.guilds[message.guild.id].isPlaying) return client.editMsg(sMessage, "I am already playing!", message);
                    client.guilds[message.guild.id].isPlaying = true;
                    client.guilds[message.guild.id].dispatcher.resume();
                    client.editMsg(sMessage, "Successfully resumed the song.", message);
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
                    resumecmd(msgToEdit);
                } else {
                    resumecmd(message);
                }
            } catch (e) {
                message.channel.send(`Something went wrong while executing the command: \`${PREFIX}resume\`\n\n\`\`\`xl\n${e}\n\`\`\``);
                console.error(e);
            }
        },
        jyguyOnly: 0,
        category: "fun"
}