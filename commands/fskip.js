module.exports = {
    help: "This command forces the bot to skip the song! (music.fskip Required)",
    func: async (client, message, args, unknownCommand, mess, sql, Discord, fs, PREFIX, bool) => {
            try {
                async function fskip(sMessage) {
                    // Checks for the custom permission
                    let bool2 = false;
                    let i = 0;
                    let prom = new Promise(resolve => {
                        message.member.roles.forEach(async role => {
                            let row = (await sql.query('SELECT * FROM permissions WHERE roleID = $1 AND pName = $2 AND pCategory = $3', [role.id, "fskip", "music"])).rows[0];
                            if ((row && row.bool) || message.member === message.guild.owner)
                                bool2 = true;
                            i++;
                            if (i === message.member.roles.size)
                                setTimeout(resolve, 10);
                        });
                    });
                    await prom;
                    if (!bool2) return client.editMsg(sMessage, ":x:, Sorry, but you do not have the `music.fskip` permission.", message);
                    if (!message.guild.me.voice.channel) return client.editMsg(sMessage, "I am not playing anything!", message);
                    if (message.member.voice.channel !== message.guild.me.voice.channel) return client.editMsg(sMessage, "You have to be in the same voice channel as me!", message);
                    if (client.guilds[message.guild.id].queue.length < 1) return client.editMsg(sMessage, "I am not playing anything!", message);
                    client.skip_song(message);
                    client.editMsg(sMessage, ":ok_hand:, Force skipping the song!", message);
                    client.guilds[message.guild.id].skippers = [];
                    client.guilds[message.guild.id].skipReq = 0;
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
                    fskip(msgToEdit);
                } else {
                    fskip(message);
                }
            } catch (e) {
                message.channel.send(`Something went wrong while executing the command: \`${PREFIX}fskip\`\n\n\`\`\`xl\n${e}\n\`\`\``);
                console.error(e);
            }
        },
        jyguyOnly: 0,
        category: "fun"
}