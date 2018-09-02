module.exports = {
    help: "Makes the chat slower for the channel i.e cooldowns for messages. (mod.slowmode Required) `Usage: ?slowdown <set or clear> <Cooldown in seconds>`",
    func: async (client, message, args, unknownCommand, mess, sql, Discord, fs, PREFIX, bool) => {
        try {
            async function slowmodecmd(sMessage) {
                // Checks for the custom permission
                let bool2 = false;
                let i = 0;
                let prom = new Promise(resolve => {
                    message.member.roles.forEach(async role => {
                        let row = await sql.get('SELECT * FROM permissions WHERE roleID = ? AND pName = ? AND pCategory = ?', [role.id, "set", "slowmode"]);
                        if ((row && row.bool) || message.member === message.guild.owner)
                            bool2 = true;
                        i++;
                        if (i === message.member.roles.size)
                            setTimeout(resolve, 10);
                    });
                });
                await prom;
                if (!bool2) return client.editMsg(sMessage, ":x:, Sorry, but you do not have the `slowmode.set` permission.", message);
                if (!args[1]) { // No Arguments (Should not be mistaken as invalid)
                    let r = await sql.get('SELECT * FROM slowmode WHERE guildId = ? AND channelId = ?', [message.guild.id, message.channel.id]);
                    if (!r) {
                        client.editMsg(sMessage, "This channel does not have a slowmode set! Use `" + PREFIX + "slowmode set <seconds>` to set one.", message);
                    } else {
                        client.editMsg(sMessage, `${r.cooldown} is the current slowmode for this channel!`, message);
                    }
                } else if (args[1].toLowerCase() === 'set') { // Set slowmode
                    let cooldown = parseInt(args[2]);
                    // If it's not a number
                    if (!cooldown) return client.editMsg(sMessage, "The cooldown has to be a number!", message);
                    // If it's lower than one / larger than 30
                    if (cooldown > 30 || cooldown < 1) return client.editMsg(sMessage, "The cooldown has to be in between 1 and 30!", message);
                    // Gets slowmode
                    let r = await sql.get('SELECT * FROM slowmode WHERE guildId = ? AND channelId = ?', [message.guild.id, message.channel.id]);
                    if (!r) { // If the row is not found
                        sql.run('INSERT INTO slowmode (guildId, cooldown, channelId) VALUES (?, ?, ?)', [message.guild.id, cooldown, message.channel.id]);
                        client.editMsg(sMessage, `Successfully set the cooldown of this channel to ${cooldown}.`, message);
                    } else { // Else
                        sql.run('UPDATE slowmode SET cooldown = ? WHERE guildId = ? AND channelId = ?', [cooldown, message.guild.id, message.channel.id]);
                        client.editMsg(sMessage, `Successfully updated the cooldown of this channel to ${cooldown}.`, message);
                    }
                } else if (args[1].toLowerCase() === 'clear') { // Clear slowmode
                    let r = await sql.get('SELECT * FROM slowmode WHERE guildId = ? AND channelId = ?', [message.guild.id, message.channel.id]);
                    if (r) {
                        sql.run('DELETE FROM slowmode WHERE guildId = ? AND channelId = ?', [message.guild.id, message.channel.id]);
                        client.editMsg(sMessage, "Successfully cleared the slowmode for this channel.", message);
                    } else {
                        client.editMsg(sMessage, 'There is no slowmode set for this channel!', message);
                    }
                } else { // Invalid argument
                    client.editMsg(sMessage, 'That is an invalid argument! The arguments are `set` and `clear`.', message);
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
                slowmodecmd(msgToEdit);
            } else {
                slowmodecmd(message);
            }
        } catch (e) {
            let rollbar = new client.Rollbar(client.rollbarKey);
            rollbar.error("Something went wrong in slowmode.js", e);
            console.error(e);
            message.channel.send(`Something went wrong while executing the command: \`${PREFIX}slowmode\`\n\n\`\`\`xl\n${e}\n\`\`\``);
        }
    },
    jyguyOnly: 0,
    category: "moderation"
}