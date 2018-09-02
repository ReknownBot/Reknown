module.exports = {
    help: "This command show a representation of an embed in the Discord API!",
    func: async (client, message, args, unknownCommand, mess, sql, Discord, fs, PREFIX, bool) => {
        try {
            async function embed(sMessage) {
                let embed = new Discord.MessageEmbed()
                    .setDescription("Hello, this is an embed.")
                    .addField("Noob841", "I'm a noob lol")
                    .addField("Noob842", "I'm a pro lol")
                    .setThumbnail(client.bot.user.displayAvatarURL())
                    .setColor(0x00FFFF)
                    .setFooter(`Requested by: ${message.author.tag}`);
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
                embed(msgToEdit);
            } else {
                embed(message);
            }
        } catch (e) {
            let rollbar = new client.Rollbar(client.rollbarKey);
            rollbar.error("Something went wrong in embed.js", e);
            console.error(e);
            message.channel.send(`Something went wrong while executing the command: \`${PREFIX}embed\`\n\n\`\`\`xl\n${e}\n\`\`\``);
        }
    },
    jyguyOnly: 0,
    category: "fun"
}