module.exports = {
    help: "Displays both the guild's tags and your tags!",
    func: async (client, message, args, unknownCommand, mess, sql, Discord, fs, PREFIX, bool) => {
            try {
                async function tagscmd(sMessage) {
                    let { rows: rows1 } = await sql.query('SELECT * FROM usertag WHERE userID = $1', [message.author.id]);
                    let userTags = [];
                    rows1.forEach(row => {
                        userTags.push(row.tagname);
                    });
                    let { rows: rows2 } = await sql.query('SELECT * FROM guildtag WHERE guildID = $1', [message.guild.id]);
                    let guildTags = [];
                    rows2.forEach(row => {
                        guildTags.push(row.tagname);
                    });
                    let embed = new Discord.MessageEmbed()
                        .setColor(message.member.displayHexColor)
                        .setTimestamp()
                        .setFooter(`Requested by ${message.author.tag}`);
                    userTags.length > 0 ? embed.addField("Your Tags", userTags.list()) : null;
                    guildTags.length > 0 ? embed.addField(`${message.guild.name}'s Tags`, guildTags.list()) : null;
                    if (embed.fields.length === 0) return client.editMsg(sMessage, "Neither you or the guild has any tags!", message);
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
                    renamecmd(msgToEdit);
                } else {
                    tagscmd(message);
                }
            } catch (e) {
                message.channel.send(`Something went wrong while executing the command: \`${PREFIX}tags\`\n\n\`\`\`xl\n${e}\n\`\`\``);
                console.error(e);
            }
        },
        jyguyOnly: 0,
        category: "misc"
}