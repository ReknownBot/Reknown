module.exports = {
  help: "Unmutes the mentioned member! (mod.unmute Required) `Usage: ?unmute <Member Mention or ID>`",
  func: async (client, message, args, unknownCommand, mess, sql, Discord, fs, PREFIX, bool) => {
      try {
        async function unmutecmd(sMessage) {
          // Checks for the custom permission
          let bool2 = false;
          let i = 0;
          let prom = new Promise(resolve => {
            message.member.roles.forEach(async role => {
              let row = await sql.get('SELECT * FROM permissions WHERE roleID = ? AND pName = ? AND pCategory = ?', [role.id, "unmute", "mod"]);
              if ((row && row.bool) || message.member === message.guild.owner)
                bool2 = true;
              i++;
              if (i === message.member.roles.size)
                setTimeout(resolve, 10);
            });
          });
          await prom;
          if (!bool2) return client.editMsg(sMessage, ":x:, Sorry, but you do not have the `mod.unmute` permission.", message);
          let person = message.guild.members.get(args[1] ? args[1].replace(/[<>@&!]/g, "") : null);
          if (!person) return client.editMsg(sMessage, "That is not a user! Mention someone to mute.", message);
          if (person.id === message.member.id) return client.editMsg(sMessage, "You cannot unmute yourself!", message);
          if (person.roles.highest.position >= message.member.roles.highest.position && message.guild.owner !== message.member) return client.editMsg(sMessage, "Insufficient permissions. (Role Positions)", message);

          let selectedRole = message.guild.roles.find(r => r.name === "Muted");

          if (!selectedRole) {
            if (!message.guild.me.hasPermission("MANAGE_ROLES")) return client.editMsg(sMessage, "I do not have enough permissions to create a role! Please make a role called 'Muted' or give me permissions.", message);
            let r = await message.guild.roles.create({
              data: {
                name: "Muted",
                color: 0xa0a0a0,
                permissions: ["VIEW_CHANNEL", 'CONNECT']
              },
              reason: "Unmute Command"
            });
            message.guild.channels.filter(c => c.type === 'text').overwritePermissions(r, {
              SEND_MESSAGES: false,
              VIEW_CHANNELS: true,
              CONNECT: true,
              SPEAK: false,
              ADD_REACTIONS: false
            });
            selectedRole = r;
          }

          if (!person.roles.has(selectedRole.id)) return client.editMsg(sMessage, "That person is not muted!", message);
          person.roles.remove(selectedRole.id, "Unmute");
          client.editMsg(sMessage, "Successfully unmuted " + person.user.tag + ".", message);

          let r = await sql.get(`SELECT * FROM logChannel WHERE guildId = ${message.guild.id}`);
          // Removes the SQLite row
          sql.run(`DELETE FROM mute WHERE guildId = ${message.guild.id} AND memberId = ${person.id}`);
          async function logChannel(selectedChannel) {
            async function unmuteThingy() {
              if (!selectedChannel) return;
              if (!message.guild.me.permissionsIn(selectedChannel).has("SEND_MESSAGES")) {
                if (!message.guild.me.hasPermission("ADMINISTRATOR")) return;
              }
              let embed = new Discord.MessageEmbed()
                .setTitle("Member Unmuted")
                .addField("Unmuted by:", message.author.tag)
                .addField("Unmuted Member:", person.user.tag)
                .setColor(0x9A4B32);
              selectedChannel.send(embed); // Action Log
            }

            let row = await sql.get(`SELECT * FROM actionlog WHERE guildId = ${message.guild.id}`);
            if (!row) {
              unmuteThingy();
              sql.run("INSERT INTO actionlog (guildId, bool) VALUES (?, ?)", [message.guild.id, 1]);
            } else {
              if (row.bool === 1)
                unmuteThingy();
            }
          }
          if (!r) {
            logChannel(message.guild.channels.find(c => c.name === "action-log"));
          } else {
            logChannel(message.guild.channels.get(r.channelId));
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
          unmutecmd(msgToEdit);
        } else {
          unmutecmd(message);
        }
      } catch (e) {
        let rollbar = new client.Rollbar(client.rollbarKey);
        rollbar.error("Something went wrong in unmute.js", e);
        console.error(e);
        message.channel.send(`Something went wrong while executing the command: \`${PREFIX}unmute\`\n\n\`\`\`xl\n${e}\n\`\`\``);
      }
    },
    jyguyOnly: 0,
    category: "moderation"
}