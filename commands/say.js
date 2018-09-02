module.exports = {
    help: "You can make me say things with this command! `Usage: ?say <Content>`",
    func: async (client, message, args, unknownCommand, mess, sql, Discord, fs, PREFIX, bool) => {
        try {
            async function saycmd(sMessage) {
                let selectedMessage = args.slice(1).join(' ');
                if (!selectedMessage) return client.editMsg(sMessage, "You have to include what I should say!", message);
                let embed = new Discord.MessageEmbed()
                    .setDescription(selectedMessage)
                    .setFooter(`Requested by ${message.author.tag}`)
                    .setColor(0x00FFFF);
                client.editMsg(sMessage, embed, message);
                if (message.channel.permissionsFor(client.bot.user).has("MANAGE_MESSAGES"))
                    message.delete(); // Deletes the message
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
                saycmd(msgToEdit);
              } else {
                saycmd(message);
              }
        } catch (e) {
            let rollbar = new client.Rollbar(client.rollbarKey);
            rollbar.error("Something went wrong in say.js", e);
            message.channel.send(`Something went wrong while executing the command: \`${PREFIX}say\`\n\n\`\`\`xl\n${e}\n\`\`\``);
            console.error(e);
        }
    },
    jyguyOnly: 0,
    category: "fun"
}