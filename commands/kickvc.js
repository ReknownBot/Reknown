module.exports = {
    help: "Kicks everyone in a voice channel. (Move Members permission required)\n\n`Usage: ?kickvc <VoiceChannel ID>`",
    func: async (client, message, args, unknownCommand, mess, sql, Discord, fs, PREFIX, bool) => {
            try {
                async function kickvccmd(sMessage) {
                    let sChannel = message.guild.channels.get(args[1]);
                    if (!sChannel) return client.editMsg(sMessage, "Please provide an ID for a voice channel for me to kick members out of.", message);
                    if (!sChannel.permissionsFor(message.member).has("MOVE_MEMBERS")) return client.editMsg(sMessage, "You do not have enough permissions!", message);
                    if (!sChannel.permissionsFor(client.bot.user).has("MOVE_MEMBERS") || !message.guild.me.hasPermission("MANAGE_CHANNELS")) return client.editMsg(sMessage, "I do not have enough permissions!", message);
                    let memberCount = sChannel.members.size;
                    if (memberCount === 0) return client.editMsg(sMessage, "There are no members in that voice channel!", message);
                    let cChannel = await message.guild.channels.create('kickvc', {
                        type: "voice"
                    });
                    sChannel.members.forEach(m => {
                        m.setVoiceChannel(cChannel);
                    });
                    let msg = await message.channel.send("Kicking members...");
                    setTimeout(() => {
                        cChannel.delete("Voice Channel Kick");
                        msg.edit(`Successfully kicked ${memberCount} ${memberCount === 1 ? "member" : "members"} out of ${sChannel}.`);
                    }, 1000);
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
                    kickvccmd(msgToEdit);
                } else {
                    kickvccmd(message);
                }
            } catch (e) {
                message.channel.send(`Something went wrong while executing the command: \`${PREFIX}kickvc\`\n\n\`\`\`xl\n${e}\n\`\`\``);
                console.error(e);
            }
        },
        jyguyOnly: 0,
        category: "moderation"
}