module.exports = {
    help: "Lists the permissions you can assign to a role!",
    func: async (client, message, args, unknownCommand, mess, sql, Discord, fs, PREFIX, bool) => {
            try {
                async function listpermscmd(sMessage) {
                    let modPerms = '';
                    client.permissions.mod.forEach(p => {
                        modPerms += `mod.${p}\n`;
                    });
                    let tagPerms = '';
                    client.permissions.tag.forEach(p => {
                        tagPerms += `tag.${p}\n`;
                    });
                    let musicPerms = '';
                    client.permissions.music.forEach(p => {
                        musicPerms += `music.${p}\n`;
                    });
                    let slowPerms = '';
                    client.permissions.slowmode.forEach(p => {
                        slowPerms += `slowmode.${p}\n`;
                    });
                    let miscPerms = '';
                    client.permissions.misc.forEach(p => {
                        miscPerms += `misc.${p}\n`;
                    });
                    let embed = new Discord.MessageEmbed()
                        .addField("Moderation", modPerms, true)
                        .addField("Tag", tagPerms, true)
                        .addField("Music", musicPerms, true)
                        .addField("Slowmode", slowPerms, true)
                        .addField("Misc", miscPerms, true)
                        .setColor(0x00FFFF)
                        .setFooter(`Requested by: ${message.author.tag}`, message.author.displayAvatarURL());
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
                    listpermscmd(msgToEdit);
                } else {
                    listpermscmd(message);
                }
            } catch (e) {
                message.channel.send(`Something went wrong while executing the command: \`${PREFIX}listperms\`\n\n\`\`\`xl\n${e}\n\`\`\``);
                console.error(e);
            }
        },
        jyguyOnly: 0,
        category: "moderation"
}