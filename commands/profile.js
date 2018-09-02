function status(activity) {
  if (activity === "dnd") {
    return "Do Not Disturb";
  } else if (activity === "online") {
    return "Online";
  } else if (activity === "offline") {
    return "Offline";
  } else {
    return "Idle";
  }
}

module.exports = {
  help: "Displays information about a user! `Usage: ?profile <Member>`",
  func: async (client, message, args, unknownCommand, mess, sql, Discord, fs, PREFIX, bool) => {
    try {
      async function profilecmd(sMessage) {
        if (!args[1]) return client.editMsg(sMessage, "You have to mention a user for me to display!", message);
        let x = message.guild.members.get(args[1] ? args[1].replace(/[<>@&!]/g, "") : null);
        if (!x) return client.editMsg(sMessage, "Mention someone to see their profile info!", message);
        let day = x.user.createdAt.getDate(),
          month = x.user.createdAt.getMonth(),
          year = x.user.createdAt.getFullYear(),
          jDay = x.joinedAt.getDate(),
          jMonth = x.joinedAt.getMonth(),
          jYear = x.joinedAt.getFullYear();
        let members = await message.guild.members.fetch();
        let memSort = members.sort((a, b) => {
          return a.joinedTimestamp - b.joinedTimestamp;
        }).array();
        let position = 0;
        for (let i = 0; i < memSort.length; i++) {
          position++;
          if (memSort[i].id === x.id)
            break;
        }
        let embed = new Discord.MessageEmbed()
          .setTitle(x.user.tag + "'s Profile Info")
          .addField("Created", `${year}-${month.toString().length === 1 ? `0${month + 1}` : month + 1}-${day.toString().length === 1 ? `0${day}` : day}`, true)
          .addField("Joined", `${jYear}-${jMonth.toString().length === 1 ? `0${jMonth + 1}` : jMonth + 1}-${jDay.toString().length === 1 ? `0${jDay}` : jDay}`, true)
          .addField("Joined Position", position, true)
          .addField("Status", status(x.user.presence.status), true)
          .addField("Game", x.presence.game ? x.presence.game.name : "None", true)
          .setThumbnail(x.user.displayAvatarURL())
          .setTimestamp()
          .setColor(0x00FFFF);
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
        profilecmd(msgToEdit);
      } else {
        profilecmd(message);
      }
    } catch (e) {
      let rollbar = new client.Rollbar(client.rollbarKey);
      rollbar.error("Something went wrong in profile.js", e);
      console.error(e);
      message.channel.send(`Something went wrong while executing the command: \`${PREFIX}profile\`\n\n\`\`\`xl\n${e}\n\`\`\``);
    }
  },
  jyguyOnly: 0,
  category: "misc"
}