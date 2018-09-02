module.exports = {
  help: "Nicks a member! (mod.nick Required) `Usage: ?nick <Member> <Nickname>`",
  func: async (client, message, args, unknownCommand, mess, sql, Discord, fs, PREFIX, bool) => {
      try {
        async function nickcmd(sMessage) {
          // Checks for the custom permission
          let bool2 = false;
          let i = 0;
          let prom = new Promise(resolve => {
            message.member.roles.forEach(async role => {
              let row = await sql.get('SELECT * FROM permissions WHERE roleID = ? AND pName = ? AND pCategory = ?', [role.id, "nick", "mod"]);
              if ((row && row.bool) || message.member === message.guild.owner)
                bool2 = true;
              i++;
              if (i === message.member.roles.size)
                setTimeout(resolve, 10);
            });
          });
          await prom;
          if (!bool2) return client.editMsg(sMessage, ":x:, Sorry, but you do not have the `mod.nick` permission.", message);
          if (!message.guild.me.hasPermission("MANAGE_NICKNAMES")) return client.editMsg(sMessage, "I do not have enough permissions!", message);
          if (!args[1]) return client.editMsg(sMessage, "Mention a user and words to nick them!\n\n`Eg. ?nick @ᴊʏɢᴜʏ#9535 Jyguy`", message);
          let person = message.guild.members.get(args[1] ? args[1].replace(/[<>@&!]/g, "") : null);
          if (!person) return client.editMsg(sMessage, "Please mention someone for me to nick!", message);
          if (person.roles.highest.position >= message.guild.me.roles.highest.position) return client.editMsg(sMessage, "My role position is not high enough!", message);
          if (person === message.guild.owner) return message.channel.send('I cannot nickname the owner!');
          if (person.roles.highest.position >= message.member.roles.highest.position && message.member !== message.guild.owner) return client.editMsg(sMessage, "Your role position is not high enough!", message);
          let text = args.slice(2).join(' ');
          if (!text) return client.editMsg(sMessage, "Type something to nick the person!", message);
          if (text.length > 32) return client.editMsg(sMessage, "The nickname cannot be over 32 letters!", message);
          if (text === person.displayName) return client.editMsg(sMessage, "The nickname you typed in is the same as that person's nickname / username!", message);

          await person.setNickname(text);
          message.channel.send("Changed " + person.user.tag + "'s nickname to " + text + ".");
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
          nickcmd(msgToEdit);
        } else {
          nickcmd(message);
        }
      } catch (e) {
        let rollbar = new client.Rollbar(client.rollbarKey);
        rollbar.error("Something went wrong in nick.js", e);
        console.error(e);
        message.channel.send(`Something went wrong while executing the command: \`${PREFIX}nick\`\n\n\`\`\`xl\n${e}\n\`\`\``);
      }
    },
    jyguyOnly: 0,
    category: "moderation"
}