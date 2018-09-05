module.exports = {
  help: "This command mutes a member! (mod.mute Required)\n\n`Usage: ?mute <Member Mention> <Time in Minutes> [Reason]`",
  func: async (client, message, args, unknownCommand, mess, sql, Discord, fs, PREFIX, bool) => {
      try {
        async function mutecmd(sMessage) {
          // Checks for the custom permission
          let bool2 = false;
          let i = 0;
          let prom = new Promise(resolve => {
            message.member.roles.forEach(async role => {
              let row = (await sql.query('SELECT * FROM permissions WHERE roleID = $1 AND pName = $2 AND pCategory = $3', [role.id, "mute", "mod"])).rows[0];
              if ((row && row.bool) || message.member === message.guild.owner)
                bool2 = true;
              i++;
              if (i === message.member.roles.size)
                setTimeout(resolve, 10);
            });
          });
          await prom;
          if (!bool2) return client.editMsg(sMessage, ":x:, Sorry, but you do not have the `mod.mute` permission.", message);
          if (!message.guild.me.hasPermission("MANAGE_ROLES") && !message.guild.me.hasPermission("ADMINISTRATOR")) return client.editMsg(sMessage, "I do not have enough permissions!", message);
          let person = message.guild.members.get(args[1] ? args[1].replace(/[<>@&!]/g, "") : null);
          if (!person) return client.editMsg(sMessage, "That is not a user! Mention someone to mute.", message);
          if (person.id === message.member.id) return client.editMsg(sMessage, "You cannot mute yourself!", message);
          if (person.roles.highest.position >= message.member.roles.highest.position && message.guild.owner !== message.member) return client.editMsg(sMessage, "You cannot mute that member! (Insufficient Role Position)", message);
          if (person.user.bot) return client.editMsg(sMessage, 'You cannot mute a bot!', message);

          let mutedRole = message.guild.roles.find(r => r.name === "Muted");

          if (!mutedRole) {
            mutedRole = await message.guild.roles.create({
              data: {
                name: "Muted",
                color: 0xa0a0a0,
                permissions: ["VIEW_CHANNEL", 'CONNECT']
              },
              reason: "Mute Command"
            });
            message.guild.channels.forEach(c => {
              c.overwritePermissions({
                overwrites: [{
                  id: mutedRole.id,
                  deny: ["SEND_MESSAGES", "SPEAK", "ADD_REACTIONS"]
                }]
              });
            });
          } else {
            message.guild.channels.forEach(c => {
              c.overwritePermissions({
                overwrites: [{
                  id: mutedRole.id,
                  deny: ["SEND_MESSAGES", "SPEAK", "ADD_REACTIONS"]
                }]
              });
            });
          }
          setTimeout(async () => {
            if (person.roles.has(mutedRole.id)) return client.editMsg(sMessage, "That person is already muted!", message);

            const roleidthingy = mutedRole.id;

            if (!args[2]) return client.editMsg(sMessage, "You need to supply a time in minutes and an optional reason!", message);
            let time = args[2];
            if (isNaN(time) || !parseInt(time)) return client.editMsg(sMessage, "The time has to be a number in minutes!", message);
            if (time > 60) return client.editMsg(sMessage, "The maximum time to mute someone is 60 minutes!", message);
            if (time < 1) return client.editMsg(sMessage, "You cannot mute someone for less than one minute!", message);
            if (mutedRole.position >= message.guild.me.roles.highest.position) return client.editMsg(sMessage, "My role position has to be higher than the Muted role!", message);
            let randomNum = Math.floor(Math.random() * 10000000);
            let optionalReason = args.slice(3).join(' ');
            if (!optionalReason) {
              // Mutes the member
              person.roles.add(roleidthingy, "Mute");

              // Unmuting Process
              setTimeout(async () => {
                // Removes the role after a certain amount of time
                if (person && mutedRole && person.roles.has(roleidthingy))
                  person.roles.remove(roleidthingy, "Auto Unmute").catch(e => {
                    let rollbar = new client.Rollbar(client.rollbarKey);
                    rollbar.error("Something went wrong in mute.js", e);
                  });
                let r = (await sql.query('SELECT * FROM mute WHERE guildId = $1 AND memberId = $2 AND randomNum = $3', [message.guild.id, person.id, randomNum])).rows[0];
                if (r)
                  sql.query('DELETE FROM mute WHERE guildId = $1 AND memberId = $2 AND randomNum = $3', [message.guild.id, person.id, randomNum]);
                let r2 = (await sql.query('SELECT * FROM actionlog WHERE guildId = $1', [message.guild.id])).rows[0];
                if (!r2 || r2.bool === 1) {
                  let r3 = (await sql.query('SELECT * FROM logChannel WHERE guildId = $1', [message.guild.id])).rows[0];
                  let embed = new Discord.MessageEmbed()
                    .setTitle("Member Unmuted")
                    .addField("Member", person.user.tag)
                    .addField("Reason", "Auto Unmute")
                    .setColor(0x00FF00);
                  if (!r3) {
                    let selectedChannel = message.guild.channels.find(c => c.name === "action-log");
                    if (selectedChannel) {
                      if (message.guild.me.hasPermission("ADMINISTRATOR") || (selectedChannel.permissionsFor(message.guild.me).has("SEND_MESSAGES") && selectedChannel.permissionsFor(message.guild.me).has("VIEW_CHANNEL")))
                        selectedChannel.send(embed);
                    }
                  } else {
                    let selectedChannel = message.guild.channels.get(r3.channelId);
                    if (selectedChannel) {
                      if (message.guild.me.hasPermission("ADMINISTRATOR") || (selectedChannel.permissionsFor(message.guild.me).has("SEND_MESSAGES") && selectedChannel.permissionsFor(message.guild.me).has("VIEW_CHANNEL")))
                        selectedChannel.send(embed);
                    }
                  }
                }
              }, time * 1000 * 60);
              // End of unmuting process

              async function muteLog() {
                let embed = new Discord.MessageEmbed()
                  .setTitle("Member Muted")
                  .addField("Muted by:", message.author.tag)
                  .addField("Muted Member:", person.user.tag)
                  .addField("Reason", "None")
                  .setColor(0x9A4B32);

                // Action Log channel
                let r = (await sql.query('SELECT * FROM logChannel WHERE guildId = $1', [message.guild.id])).rows[0];
                async function logChannel(selectedChannel) {
                  if (selectedChannel) {
                    if (message.guild.me.hasPermission("ADMINISTRATOR") || (selectedChannel.permissionsFor(message.guild.me).has("SEND_MESSAGES") && selectedChannel.permissionsFor(message.guild.me).has("VIEW_CHANNEL")))
                      selectedChannel.send({
                        embed: embed
                      });
                  }
                }
                if (!r) {
                  logChannel(message.guild.channels.find(c => c.name === "action-log"));
                } else {
                  logChannel(message.guild.channels.get(r.channelId));
                }
              }

              // Checks if it's enabled
              let row = (await sql.query('SELECT * FROM actionlog WHERE guildId = $1', [message.guild.id])).rows[0];
              if (!row) {
                sql.query("INSERT INTO actionlog (guildId, bool) VALUES ($1, $2)", [message.guild.id, 1]);
                muteLog();
              } else {
                if (row.bool === 1)
                  muteLog();
              }
              sql.query("INSERT INTO mute (guildId, memberId, randomNum) VALUES ($1, $2, $3)", [message.guild.id, person.id, randomNum]);
              client.editMsg(sMessage, `Successfully muted ${person}.`, message);
            } else { // If there is a reason
              // Mutes the member
              person.roles.add(roleidthingy, "Mute: " + optionalReason);

              // Unmuting Process
              setTimeout(async () => {
                // Removes the role after a certain amount of time
                if (person)
                  person.roles.remove(roleidthingy, "Auto Unmute");
                let r = (await sql.query('SELECT * FROM mute WHERE guildId = $1 AND memberId = $2 AND randomNum = $3', [message.guild.id, person.id, randomNum])).rows[0];
                if (r)
                  sql.query('DELETE FROM mute WHERE guildId = $1 AND memberId = $2 AND randomNum = $3', [message.guild.id, person.id, randomNum]);
                let r2 = (await sql.query('SELECT * FROM actionlog WHERE guildId = $1', [message.guild.id])).rows[0];
                if (!r2 || r2.bool === 1) {
                  let r3 = (await sql.query('SELECT * FROM logChannel WHERE guildId = $1', [message.guild.id])).rows[0];
                  let embed = new Discord.MessageEmbed()
                    .setTitle("Member Unmuted")
                    .addField("Member", person.user.tag)
                    .addField("Muted by", message.author.tag)
                    .addField("Reason", 'Auto Unmute')
                    .setColor(0x00FF00);
                  if (!r3) {
                    let selectedChannel = message.guild.channels.find(c => c.name === "action-log");
                    if (selectedChannel) {
                      if (message.guild.me.hasPermission("ADMINISTRATOR") || (selectedChannel.permissionsFor(message.guild.me).has("SEND_MESSAGES") && selectedChannel.permissionsFor(message.guild.me).has("VIEW_CHANNEL")))
                        selectedChannel.send(embed);
                    }
                  } else {
                    let selectedChannel = message.guild.channels.get(r3.channelId);
                    if (selectedChannel) {
                      if (message.guild.me.hasPermission("ADMINISTRATOR") || (selectedChannel.permissionsFor(message.guild.me).has("SEND_MESSAGES") && selectedChannel.permissionsFor(message.guild.me).has("VIEW_CHANNEL")))
                        selectedChannel.send(embed);
                    }
                  }
                }
              }, time * 1000 * 60);
              // End of unmuting process

              async function muteLog() {
                let embed = new Discord.MessageEmbed()
                  .setTitle("Member Muted")
                  .addField("Muted by:", message.author.tag)
                  .addField("Muted Member:", person.user.tag)
                  .addField("Reason", optionalReason)
                  .setColor(0x9A4B32);

                // Action Log channel
                let r = (await sql.query('SELECT * FROM logChannel WHERE guildId = $1', [message.guild.id])).rows[0];

                function logChannel(selectedChannel) {
                  if (selectedChannel) {
                    if (message.guild.me.hasPermission("ADMINISTRATOR") || (selectedChannel.permissionsFor(message.guild.me).has("SEND_MESSAGES") && selectedChannel.permissionsFor(message.guild.me).has("VIEW_CHANNEL")))
                      selectedChannel.send({
                        embed: embed
                      });
                  }
                }
                if (!r) {
                  logChannel(message.guild.channels.find(c => c.name === "action-log"));
                } else {
                  logChannel(message.guild.channels.get(r.channelId));
                }
              }

              // Checks if it's enabled
              let row = (await sql.query('SELECT * FROM actionlog WHERE guildId = $1', [message.guild.id])).rows[0];
              if (!row) {
                sql.query("INSERT INTO actionlog (guildId, bool) VALUES ($1, $2)", [message.guild.id, 1]);
                muteLog();
              } else {
                if (row.bool === 1)
                  muteLog();
              }
              sql.query("INSERT INTO mute (guildId, memberId, randomNum) VALUES ($1, $2, $3)", [message.guild.id, person.id, randomNum]);
              client.editMsg(sMessage, `Successfully muted ${person} for ${optionalReason}`, message);
            }
          }, 1000);
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
          mutecmd(msgToEdit);
        } else {
          mutecmd(message);
        }
      } catch (e) {
        let rollbar = new client.Rollbar(client.rollbarKey);
        rollbar.error("Something went wrong in mute.js", e);
        message.channel.send(`Something went wrong while executing the command: \`${PREFIX}mute\`\n\n\`\`\`xl\n${e}\n\`\`\``);
        console.error(e);
      }
    },
    jyguyOnly: 0,
    category: "moderation"
}