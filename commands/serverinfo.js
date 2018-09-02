module.exports = {
    help: "Gives you the server information.",
    func: async (client, message, args, unknownCommand, mess, sql, Discord, fs, PREFIX, bool) => {
        try {
            async function serverinfocmd(sMessage) {
                let members = await message.guild.members.fetch();
                let day = message.guild.createdAt.getDate(),
                    month = message.guild.createdAt.getMonth(),
                    year = message.guild.createdAt.getFullYear();
                let embed = new Discord.MessageEmbed()
                    .setTitle(message.guild.name + " Server Info")
                    .setColor(0x00FFFF)
                    .addField("Member Count:", message.guild.memberCount, true)
                    .addField("People Count", members.filter(m => !m.user.bot).size, true)
                    .addField("Bot Count:", members.filter(m => m.user.bot).size, true)
                    .addField("Role Count:", message.guild.roles.size, true)
                    .addField("Channel Count:", message.guild.channels.size, true)
                    .addField("Standard Emoji Count:", message.guild.emojis.filter(e => !e.animated).size, true)
                    .addField("Animated Emoji Count", message.guild.emojis.filter(e => e.animated).size, true)
                    .addField("Server Created:", `${year}-${month.toString().length === 1 ? `0${month + 1}` : month + 1}-${day.toString().length === 1 ? `0${day}` : day}`, true)
                    .setFooter("Requested by: " + message.author.tag)
                    .setThumbnail(message.guild.iconURL())
                    .setTimestamp();

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
                serverinfocmd(msgToEdit);
            } else {
                serverinfocmd(message);
            }
        } catch (e) {
            let rollbar = new client.Rollbar(client.rollbarKey);
            rollbar.error("Something went wrong in serverinfo.js", e);
            console.error(e);
            message.channel.send(`Something went wrong while executing the command: \`${PREFIX}serverinfo\`\n\n\`\`\`xl\n${e}\n\`\`\``);
        }
    },
    jyguyOnly: 0,
    category: "misc"
}