module.exports = {
  help: "Deletes the warn for a user. (Manage Server Permission required) `Usage: ?deletewarn <Member> <WarnID>`",
  func: async (client, message, args, unknownCommand, mess, sql, Discord, fs, PREFIX, bool) => {
    try {
      async function deletewarn(sMessage) {
        // Checks for the custom permission
        let bool2 = false;
        let i = 0;
        let prom = new Promise(resolve => {
          message.member.roles.forEach(async role => {
            let row3 = await sql.get('SELECT * FROM permissions WHERE roleID = ? AND pName = ? AND pCategory = ?', [role.id, "unwarn", "mod"]);
            if ((row3 && row3.bool) || message.member === message.guild.owner)
              bool2 = true;
            i++;
            if (i === message.member.roles.size)
              setTimeout(resolve, 10);
          });
        });
        await prom;
        if (!bool2) return client.editMsg(sMessage, ":x:, Sorry, but you do not have the `mod.unwarn` permission.", message);
        let selectedMember = message.guild.members.get(args[1] ? args[1].replace(/[<>@&!]/g, "") : null);
        if (!selectedMember) return client.editMsg(sMessage, "You have to mention a user for me to warn!", message);
        if (selectedMember.roles.highest.position >= message.member.roles.highest.position && message.member.id !== '288831103895076867' && message.guild.owner !== message.member) return client.editMsg(sMessage, "Insufficient permissions. (Role position equal or lower)", message);
        if (selectedMember === message.member && message.guild.owner !== message.member) return client.editMsg(sMessage, "You cannot unwarn yourself! That's cheating.", message);
        if (selectedMember.user.bot) return client.editMsg(sMessage, "You cannot delete a warning of a bot!", message);
        let warnNumber = args[2];
        if (!warnNumber) return client.editMsg(sMessage, "You have to include a warning number for me to remove! Use ?warnings <user> to get the numbers.\n\n`Eg. ?deletewarn @ᴊʏɢᴜʏ 1`", message);
        if (!parseInt(warnNumber)) return client.editMsg(sMessage, "That is not a valid number!", message);
        if (warnNumber < 1) return client.editMsg(sMessage, "It cannot be a negative number / 0!", message);
        let row = await sql.get("SELECT * FROM warnings WHERE warnID = ? AND userId2 = ?", [warnNumber, selectedMember.id + message.guild.id]);
        if (row) {
          let row2 = await sql.run("DELETE FROM warnings WHERE warnID = ? AND userId2 = ?", [warnNumber, selectedMember.id + message.guild.id]);
          client.editMsg(sMessage, `Successfully deleted a warning from ${selectedMember.user.tag}.`, message);
          sql.run("UPDATE warnings SET warnAmount = ? WHERE userId2 = ?", [row2.warnAmount - 1, selectedMember.id + message.guild.id]);
        } else
          client.editMsg(sMessage, "Warning not found. Check a warn ID using `" + PREFIX + "warnings " + selectedMember + "`", message);
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
        deletewarn(msgToEdit);
      } else {
        deletewarn(message);
      }
    } catch (e) {
      let rollbar = new client.Rollbar(client.rollbarKey);
      rollbar.error("Something went wrong in deletewarn.js", e);
      console.error(e);
      message.channel.send(`Something went wrong while executing the command: \`${PREFIX}deletewarn\`\n\n\`\`\`xl\n${e}\n\`\`\``);
    }
  },
  jyguyOnly: 0,
  category: "moderation"
}