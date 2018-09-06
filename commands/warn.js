module.exports = {
  help: "This command warns a user and can be removed with the removewarn command! (See warnings with ?warnings command) [Needs Permission Manage Server] `Usage: ?warn <Member>`",
  func: async (client, message, args, unknownCommand, mess, sql, Discord, fs, PREFIX, bool) => {
    try {
      async function warncmd(sMessage) {
        // Checks for the custom permission
        let bool2 = false;
        let i = 0;
        let prom = new Promise(resolve => {
          message.member.roles.forEach(async role => {
            let row = (await sql.query('SELECT * FROM permissions WHERE roleID = $1 AND pName = $2 AND pCategory = $3', [role.id, 'warn', 'mod'])).rows[0];
            if ((row && row.bool) || message.member === message.guild.owner)
              bool2 = true;
            i++;
            if (i === message.member.roles.size)
              setTimeout(resolve, 10);
          });
        });
        await prom;
        if (!bool2) return client.editMsg(sMessage, ":x:, Sorry, but you do not have the `mod.warn` permission.", message);
        if (!args[1]) return client.editMsg(sMessage, "You must supply a user for me to warn!", message);
        let person = message.guild.members.get(args[1] ? args[1].replace(/[<>@&!]/g, "") : null);
        if (!person) return client.editMsg(sMessage, "You must supply a user for me to warn!", message);
        if (person.roles.highest.position >= message.member.roles.highest.position && message.member.id !== '288831103895076867' && message.guild.owner !== message.member) return client.editMsg(sMessage, "You have insufficient permissions. (Role Position Lower or Equal)", message);
        if (message.guild.owner === person) return client.editMsg(sMessage, "I cannot warn an owner!", message);
        if (message.member === person) return client.editMsg(sMessage, "You cannot warn yourself!", message);
        if (person.user.bot) return client.editMsg(sMessage, "You cannot warn bots!", message);
        message.channel.send("Starting message collector, please say what they have done, or say cancel to abort.");
        let embedthingy = new Discord.MessageEmbed();
        let collector = message.channel.createMessageCollector(m => m.author.id === message.author.id && m.channel.id === message.channel.id, {
          time: 30000
        });

        collector.on("collect", async collected => {
          if (collected.content.toLowerCase().trim() === "cancel") {
            collector.stop();
            client.editMsg(sMessage, "Ok, aborting action.", message);
          } else {
            if (collected.content.length < 1) return message.channel.send("That is not a valid message, please send letters.");
            if (collected.content.length > 1000) return message.channel.send("Reasons may not exceed 1000 characters.");
            collector.stop();
            let reason = collected.content;
            embedthingy.addField("thingy", reason);
            message.channel.send("How many warnings do they have now? (Say 'cancel' to abort)");
            let collector2 = message.channel.createMessageCollector(msg => msg.author.id === message.author.id && msg.channel.id === message.channel.id, {
              time: 25000
            });
            collector2.on('collect', async collected => {
              if (collected.content.trim().toLowerCase() === 'cancel') {
                collector2.stop();
                client.editMsg(sMessage, ":ok:, Aborting action.", message);
              } else {
                if (!parseInt(collected.content) && collected.content != 0) return message.channel.send("That is not a number, please say a number, or say 'cancel' to abort.");
                else {
                  let warnAmount = collected.content;
                  if (warnAmount < 0) return message.channel.send("There cannot be negative warning amounts!");
                  let warnReason = embedthingy.fields[0].value;
                  let embed = new Discord.MessageEmbed() // Embed to send to warning channel and action log if existant
                    .setTitle(person.user.tag + " Warned by: " + message.author.tag)
                    .addField("Reason:", warnReason)
                    .addField("Total Warns:", warnAmount.length <= 1024 ? warnAmount.length : "Too long to display")
                    .setColor(0x00FFFF)
                    .setTimestamp();
                  let embed2 = new Discord.MessageEmbed()
                    .setTitle(`You were warned by: ${message.author.tag} in ${message.guild.name}`)
                    .addField("Reason:", warnReason)
                    .addField("Total Warns:", warnAmount)
                    .setColor(0x00FFFF)
                    .setTimestamp();

                  collector2.stop();
                  person.user.send(embed2).catch(e => {
                    if (e != "DiscordAPIError: Cannot send messages to this user") {
                      let rollbar = new client.Rollbar(client.rollbarKey);
                      rollbar.error("Something went wrong in warn.js", e);
                    }
                  });
                  client.editMsg(sMessage, "Ok, warned " + person.user.tag + " (Total " + warnAmount + ") for the reason of: " + warnReason + ".", message);
                  sql.query('INSERT INTO warnings (userId2, warnAmount, warnReason) VALUES ($1, $2, $3)', [person.id + message.guild.id, warnAmount, warnReason]);

                  let r = (await sql.query('SELECT * FROM logChannel WHERE guildId = $1', [message.guild.id])).rows[0];
                  let selectedChannel;
                  if (!r) {
                    selectedChannel = message.guild.channels.find(c => c.name === "action-log");
                  } else {
                    selectedChannel = message.guild.channels.get(r.channelid);
                  }
                  if (selectedChannel)
                    selectedChannel.send(embed);
                }
              }
            });
            collector2.on('end', collected => {
              if (collected.size < 1) return client.editMsg(sMessage, "No response collected, aborting action.", message);
            });
          }
        });
        collector.on("end", collected => { // When the collector ends
          if (collected.size < 1) return message.channel.send("No response collected, aborting action."); // If no messages has been collected then return and send a message
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
        warncmd(msgToEdit);
      } else {
        warncmd(message);
      }
    } catch (e) {
      let rollbar = new client.Rollbar(client.rollbarKey);
      rollbar.error("Something went wrong in warn.js", e);
      console.error(e);
      message.channel.send(`Something went wrong while executing the command: \`${PREFIX}warn\`\n\n\`\`\`xl\n${e}\n\`\`\``);
    }
  },
  jyguyOnly: 0,
  category: "moderation"
}