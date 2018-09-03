const applyText = (canvas, text) => {
  const ctx = canvas.getContext('2d');
  let fontSize = 70;

  do {
    ctx.font = `${fontSize -= 10}px "Mistral"`;
  } while (ctx.measureText(text).width > canvas.width - 600);

  return ctx.font;
};

module.exports = {
  func: async (client, sql, Discord) => {
    // Starts an event
    client.bot.on('guildMemberAdd', async member => {
      try { // Just in case
        // If the bot has no perms then return
        if (!member.guild.me.hasPermission("SEND_MESSAGES")) return;
        if (!member.guild.me.hasPermission("VIEW_CHANNEL")) return;

        // Autorole
        let r3 = await sql.all(`SELECT * FROM autorole WHERE guildId = ${member.guild.id}`);
        if (Object.values(r3).length !== 0 && member.guild.me.hasPermission("MANAGE_ROLES")) {
          r3.forEach(r => {
            // Gets the role
            let autoRole = member.guild.roles.get(r.roleId);
            if (!autoRole)
              sql.run("DELETE FROM autorole WHERE guildId = ? AND roleId = ?", [message.guild.id, r.roleId]);
            else if (autoRole && autoRole.position < member.guild.me.roles.highest.position)
              // Adds the role
              member.roles.add(autoRole, "Reknown Autorole");
          });
        }
        // End of autorole

        // Checks if the guild has welcome messages enabled
        r3 = await sql.get(`SELECT * FROM toggleWelcome WHERE guildId = ${member.guild.id}`);
        if (r3 && r3.bool) {
          // Gets the welcome channel for the guild
          let r = await sql.get(`SELECT * FROM welcomeChannel WHERE guildId = ${member.guild.id}`);
          // This is for the welcome channel
          async function welcomeChannel(welcomeChannel) {
            // If the channel exists
            if (welcomeChannel) {
              // If the bot does not have send messages perms in the welcome channel & does not have administrator (bypass all overwrites) then return
              if (!member.guild.me.permissionsIn(welcomeChannel).has("SEND_MESSAGES") && !member.guild.me.hasPermission("ADMINISTRATOR")) return;
              if (!member.guild.me.permissionsIn(welcomeChannel).has("VIEW_CHANNEL")) {
                if (!member.guild.me.hasPermission("ADMINISTRATOR")) return;
              }
              //console.log("guildMemberAdd 1");

              // Function for welcoming messages
              async function welcomeMessages(msg) {
                let row2 = await sql.get(`SELECT * FROM picwelcome WHERE guildId = ${member.guild.id}`);
                if (!row2 || row2.bool) {
                  const canvas = client.canvas.createCanvas(1600, 600);
                  const ctx = canvas.getContext('2d');
  
                  const background = await client.canvas.loadImage('./background.png');
                  ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
  
                  ctx.strokeStyle = '#74037b';
                  ctx.strokeRect(0, 0, canvas.width, canvas.height);
  
                  ctx.font = await applyText(canvas, msg);
                  ctx.fillStyle = '#FF0000';
                  ctx.fillText(msg, 600, 100);
  
                  const {
                    body: buffer
                  } = await client.fetch(member.user.displayAvatarURL({ format: "png" }));
				  
				  try {
					const avatar = await client.canvas.loadImage(buffer);
					ctx.drawImage(avatar, 50, 50, canvas.height - 100, canvas.height - 100);
  
					const attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'welcome-image.png');
					welcomeChannel.send({
						files: [attachment]
					});
				  } catch(e) {
					let embed = new Discord.MessageEmbed()
						.setDescription(msg)
						.setColor(0x00FF00)
						.setThumbnail(member.user.displayAvatarURL())
						.setFooter("This message was shown since the image failed to load.")
						.setTimestamp();
					welcomeChannel.send(embed);
				  }
                } else {
                  let embed = new Discord.MessageEmbed()
                    .setDescription(msg)
                    .setColor(0x00FF00)
                    .setThumbnail(member.user.displayAvatarURL())
                    .setTimestamp();
                  welcomeChannel.send(embed);
                }
              }

              // Gets the welcoming message for the guild
              let r2 = await sql.get(`SELECT * FROM customMessages WHERE guildId = ${member.guild.id}`);
              if (!r2) { // If the row is not found (i.e no custom welcoming message)
                welcomeMessages(`${member.user.tag} joined ${member.guild.name}.\n\nThere are *${member.guild.memberCount}* members now.`);
              } else { // Vise versa
                // If the custom message is invalid for some reason, use the default instead
                let customMessage = r2.customMessage.replace("<User>", member.user.tag).replace("<Guild>", member.guild.name).replace("<MemberCount>", member.guild.memberCount) || `${member}, Welcome to **${member.guild.id}!** There are ${member.guild.memberCount} members now.`;
                welcomeMessages(customMessage);
              }
            }
          }
          // If it is default
          if (!r || !r.channel)
            welcomeChannel(member.guild.channels.find(c => c.position === 0 && c.type === 'text'));
          else // If it's custom
            welcomeChannel(member.guild.channels.get(r.channel));
        }

        // Checks if the guild has action log enabled
        let r = await sql.get(`SELECT * FROM actionlog WHERE guildId = ${member.guild.id}`);
        if (r && r.bool) { // If they have it enabled
          // Creates an embed
          let embed = new Discord.MessageEmbed()
            .setColor(0x00ff00)
            .setThumbnail(member.user.displayAvatarURL())
            .setTimestamp()
            .setDescription(`**Member:** ${member.user.tag} :: ${member.id}`)
            .setTitle("Member Joined");
          // Looks for the log channel selected
          let r2 = await sql.get(`SELECT * FROM logChannel WHERE guildId = ${member.guild.id}`);
          if (!r2 || !r2.channelId) { // If it is default
            let selectedChannel = member.guild.channels.find(c => c.name === "action-log");
            if (selectedChannel) {
              if (!member.guild.me.permissionsIn(selectedChannel).has("SEND_MESSAGES") && !member.guild.me.hasPermission("ADMINISTRATOR")) return;
              if (!member.guild.me.permissionsIn(selectedChannel).has("VIEW_CHANNEL")) {
                if (!member.guild.me.hasPermission("ADMINISTRATOR")) return;
              }
              //console.log("guildMemberAdd 2");
              selectedChannel.send(embed);
            }
          } else { // If it is custom
            let selectedChannel = member.guild.channels.get(r2.channelId);
            if (selectedChannel) {
              if (!member.guild.me.permissionsIn(selectedChannel).has("SEND_MESSAGES") && !member.guild.me.hasPermission("ADMINISTRATOR")) return;
              if (!member.guild.me.permissionsIn(selectedChannel).has("VIEW_CHANNEL")) {
                if (!member.guild.me.hasPermission("ADMINISTRATOR")) return;
              }
              //console.log("guildMemberAdd 2");
              // Sends the embed
              selectedChannel.send(embed);
            }
          }
        }

        // Checks if the member is muted
        r = await sql.get(`SELECT * FROM mute WHERE guildId = ${member.guild.id} AND memberId = ${member.id}`);
        if (r) { // If the row is found
          // If the bot has permissions to add a role
          if (member.guild.me.hasPermission("MANAGE_ROLES")) {
            // Gets the role
            let muteRole = member.guild.roles.find(r => r.name === "Muted");
            // If the role still exists
            if (muteRole)
              // Adds the role
              member.roles.add(muteRole);
          }
        }
      } catch (e) { // Error occured >:)
        let rollbar = new client.Rollbar(client.rollbarKey);
        rollbar.error("Something went wrong in guildMemberAdd.js", e);
        console.log(e);
      }
    });
  }
}