module.exports = {
  help: "This command displays the avatar of a user! `Usage: ?avatar [Member]`",
  func: async (client, message, args, unknownCommand, mess, sql, Discord, fs, PREFIX, bool) => {
      try {
        async function avatarcmd(sMessage) {
          let member = message.guild.members.get(args[1] ? args[1].replace(/[<>@&!]/g, "") : null);
          if (!args[1]) {
            let embed = new Discord.MessageEmbed()
              .setTitle("Your Avatar:")
              .setImage(message.author.displayAvatarURL())
              .setColor(0x00FFFF);
            client.editMsg(sMessage, embed, message);
          } else {
            if (!member) return client.editMsg(sMessage, "That user doesn't exist! Mention someone for their avatar!", message);
            let embed = new Discord.MessageEmbed()
              .setTitle(member.user.tag + "'s avatar:")
              .setImage(member.user.displayAvatarURL())
              .setColor(0x00FFFF);
            client.editMsg(sMessage, embed, message);
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
          avatarcmd(msgToEdit);
        } else {
          avatarcmd(message);
        }
      } catch (e) {
        let rollbar = new client.Rollbar(client.rollbarKey);
        rollbar.error("Something went wrong in avatar.js", e);
        console.log(e);
        message.channel.send(`Something went wrong while executing the command: \`${PREFIX}avatar\`\n\n\`\`\`xl\n${e}\n\`\`\``);
      }
    },
    jyguyOnly: 0,
    category: "misc"
}