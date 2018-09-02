module.exports = {
  help: "Sets the status for me. `Usage: ?setstatus <Status>`",
  func: async (client, message, args, unknownCommand, mess, sql, Discord, fs, PREFIX, bool) => {
    try {
      async function setstatuscmd(sMessage) {
        if (message.member.id !== "288831103895076867") {
          let arr = [];
          client.commandsList.forEach(command => {
            let rawcommand = command.slice(0, command.length - 3);
            let item = client.commands[rawcommand];
            let guildID = message.guild.id;
            // If the message author ID is Jyguy, add it to the list regardless of guilds
            if (message.author.id === '288831103895076867') {
              arr.push(`${rawcommand} ${client.fuzz.ratio(rawcommand, args[0])}`);
              // From now on the member will be 100% not jyguy
            } else if (!item.jyguyOnly)
              arr.push(`${rawcommand} ${client.fuzz.ratio(rawcommand, args[0])}`);
          });
          let arr2 = arr.sort((a, b) => {
            return b.split(' ')[1] - a.split(' ')[1];
          });
          client.editMsg(sMessage, `Could not find the command. Did you mean \`${arr2[0].split(' ')[0]}, ${arr2[1].split(' ')[0]}, or ${arr2[2].split(' ')[0]}\`?`, message);
          return;
        }
        let status1 = args[1];
        if (!status1) return client.editMsg(sMessage, "You need to put a status for me to change to!", message);
        if (status1.toLowerCase() === "online" || status1.toLowerCase() === "idle" || status1.toLowerCase() === "dnd" || status1.toLowerCase() === "invisible") {
          client.bot.user.setStatus(status1);
          client.editMsg(sMessage, "Successfully changed my status to " + status1 + ".", message);
        } else {
          client.editMsg(sMessage, "You have to provide a status for me!", message);
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
        setstatuscmd(msgToEdit);
      } else {
        setstatuscmd(message);
      }
    } catch (e) {
      let rollbar = new client.Rollbar(client.rollbarKey);
      rollbar.error("Something went wrong in setstatus.js", e);
      message.channel.send(`Something went wrong while executing the command: \`${PREFIX}setstatus\`\n\n\`\`\`xl\n${e}\n\`\`\``);
      console.error(e);
    }
  },
  jyguyOnly: 1,
  category: "misc"
}