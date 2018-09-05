module.exports = {
    help: "Shows the prefix.",
    func: async (client, message, args, unknownCommand, mess, sql, Discord, fs, PREFIX, bool) => {
            try {
                async function prefixcmd(sMessage) {
                    let row = (await sql.query("SELECT * FROM prefix WHERE guildId = $1", [message.guild.id])).rows[0];
                    let prefix;
                    if (!row)
                        prefix = "?";
                    else
                        prefix = row.customprefix;

                    client.editMsg(sMessage, `The current prefix for ${message.guild.name} is ${prefix} or my mention! \`Take a look at "${PREFIX}config prefix" to set the prefix.\``, message);
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
                    prefixcmd(msgToEdit);
                } else {
                    prefixcmd(message);
                }
            } catch (e) {
                message.channel.send(`Something went wrong while executing the command: \`${PREFIX}prefix\`\n\n\`\`\`xl\n${e}\n\`\`\``);
                console.error(e);
            }
        },
        jyguyOnly: 0,
        category: "misc"
}