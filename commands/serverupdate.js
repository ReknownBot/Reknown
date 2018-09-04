module.exports = {
  help: "Sends a server update in a server-update channel. (misc.update Required) `Usage: ?serverupdate <Update Content>`",
  func: async (client, message, args, unknownCommand, mess, sql, Discord, fs, PREFIX, bool) => {
    try {
      async function supdatecmd(sMessage) {
        // Checks for the custom permission
        let bool2 = false;
        let i = 0;
        let prom = new Promise(resolve => {
          message.member.roles.forEach(async role => {
            let row = (await sql.query('SELECT * FROM permissions WHERE roleID = $1 AND pName = $2 AND pCategory = $3', [role.id, "update", "misc"])).rows[0];
            if ((row && row.bool) || message.member === message.guild.owner)
              bool2 = true;
            i++;
            if (i === message.member.roles.size)
              setTimeout(resolve, 10);
          });
        });
        await prom;
        if (!bool2) return client.editMsg(sMessage, ":x:, Sorry, but you do not have the `misc.update` permission.", message);
        let row2 = (await sql.query('SELECT * FROM updatechannel WHERE guildID = $1', [message.guild.id])).rows[0];
        if (!row2) return client.editMsg(sMessage, 'This server does not have an update channel set! Use `?config updatechannel <Channel Mention or ID>` to set one.', message);
        let selectedChannel = message.guild.channels.get(row2.channelID);
        if (!selectedChannel) return client.editMsg(sMessage, "Server updates channel not found. Please update it by using `config updatechannel <Channel Mention or ID>`.", message);
        let updateinfo = args.slice(1).join(" ");
        if (!updateinfo) return client.editMsg(sMessage, "Please supply update info.", message);
        let embed = new Discord.MessageEmbed()
          .setTimestamp()
          .setColor(0x00FFFF)
          .setFooter("Requested by: " + message.author.tag)
          .setDescription(updateinfo + "\n_ _");
        message.channel.send("Please say the version of the server, or say 'cancel' to abort.");
        let collector = message.channel.createMessageCollector(m => m.author.id === message.author.id && m.channel.id === message.channel.id, {
          time: 60000
        });
        collector.on('collect', collected => {
          if (collected.content.toLowerCase().trim() === 'cancel') {
            collector.stop();
            client.editMsg(sMessage, "Ok, aborting action.", message);
          } else {
            collector.stop();
            embed.addField("Version:", collected.content);
            selectedChannel.send(embed);
            client.editMsg(sMessage, "Successfully finished sending an update in " + selectedChannel.name + ".", message);
          }
        });

        collector.on('end', collected => {
          if (collected.size < 1) return client.editMsg(sMessage, "Time (1 Minute) ran out, aborting action.", message);
        });
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
        supdatecmd(msgToEdit);
      } else {
        supdatecmd(message);
      }
    } catch (e) {
      let rollbar = new client.Rollbar(client.rollbarKey);
      rollbar.error("Something went wrong in serverupdate.js", e);
      console.error(e);
      message.channel.send(`Something went wrong while executing the command: \`${PREFIX}serverupdate\`\n\n\`\`\`xl\n${e}\n\`\`\``);
    }
  },
  jyguyOnly: 0,
  category: "moderation"
}