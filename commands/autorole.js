module.exports = {
    help: "Sets the role to give out to members when they join. You can even have multiple! (misc.autorole Required)\n`Usage: ?levelrole <Argument> [<Role ID or Mention>]\nArguments: add, remove, clear, and list`",
    func: async (client, message, args, unknownCommand, mess, sql, Discord, fs, PREFIX, bool) => {
        try { // Just in case
            async function autorole(sMessage) {
                // Checks for the custom permission
                let bool2 = false;
                let i = 0;
                let prom = new Promise((resolve, reject) => {
                    message.member.roles.forEach(async role => {
                        let row = (await sql.query(`SELECT * FROM permissions WHERE roleID = '${role.id}' AND pName = 'autorole' AND pCategory = 'misc'`)).rows[0];
                        if ((row && row.bool) || message.member === message.guild.owner)
                            bool2 = true;
                        i++;
                        if (i === message.member.roles.size)
                            setTimeout(resolve, 10);
                    });
                });
                await prom;
                if (!bool2) return client.editMsg(sMessage, ":x:, Sorry, but you do not have the `misc.autorole` permission.", message);

                // If no arguments have been put, send a message
                if (!args[1]) return client.editMsg(sMessage, "You have to put a valid argument! (Eg. " + PREFIX + "autorole remove) There are add, remove, clear, and list.", message);
                // Checks if the argument is add
                if (args[1].toLowerCase() === "add") {
                    // Defines the role
                    let selectedRole = message.guild.roles.get(args[2] ? args[2].replace(/[<>@&]/g, "") : null);
                    // If the role is not found by ID or there was no role mention
                    if (!selectedRole) return client.editMsg(sMessage, 'You have to mention or supply a valid ID of a role for me to set the auto role for this server!', message);
                    // Checks if the role is @everyone
                    if (selectedRole === message.guild.defaultRole) return client.editMsg(sMessage, "You cannot set the autorole as `@everyone`!", message);
                    let ro = (await sql.query(`SELECT * FROM autorole WHERE roleId = ${selectedRole.id} AND guildId = ${message.guild.id}`)).rows[0];
                    if (ro) return client.editMsg(sMessage, "That role is already in the auto role list!", message);
                    // Inserts the row with the information
                    sql.query(`INSERT INTO autorole (guildId, roleId) VALUES ('${message.guild.id}', '${selectedRole.id}')`);
                    // Send a message either way
                    client.editMsg(sMessage, `Successfully added to the auto roles; ${selectedRole.name} (${selectedRole.id}).`, message);
                } else if (args[1].toLowerCase() === "remove") {
                    // Defines the role
                    let selectedRole = message.guild.roles.get(args[2] ? args[2].replace(/[<>@&]/g, "") : null);
                    // If the role is not found by ID or there was no role mention
                    if (!selectedRole) return client.editMsg(sMessage, 'You have to mention or supply a valid ID of a role for me to set the auto role for this server!', message);
                    let r = (await sql.query(`SELECT * FROM autorole WHERE roleId = '${selectedRole.id}'`)).rows[0];
                    if (!r) return client.editMsg(sMessage, "The auto role does not exist!", message);
                    sql.query(`DELETE FROM autorole WHERE roleId = '${selectedRole.id}'`);
                    client.editMsg(sMessage, `Successfully removed ${selectedRole.name} from the auto roles.`, message);
                } else if (args[1].toLowerCase() === "clear") {
                    let { rows } = await sql.query(`SELECT * FROM autorole WHERE guildId = '${message.guild.id}'`);
                    if (rows.length === 0) return client.editMsg(sMessage, `There are no auto roles set yet! Use ${PREFIX}autorole add <Mention or RoleID> to add one.`, message);
                    sql.query(`DELETE FROM autorole WHERE guildId = '${message.guild.id}'`);
                    client.editMsg(sMessage, "Successfully cleared the autorole.", message);
                } else if (args[1].toLowerCase() === "list") {
                    let { rows } = await sql.query(`SELECT * FROM autorole WHERE guildId = '${message.guild.id}'`);
                    if (rows.length === 0) return client.editMsg(sMessage, "This guild does not have any auto roles!", message);
                    let x = [];
                    rows.forEach(r => {
                        if (!message.guild.roles.get(r.roleid))
                            sql.query(`DELETE FROM autorole WHERE guildId = '${message.guild.id}' AND roleId = '${r.roleid}'`);
                        else
                            x.push(message.guild.roles.get(r.roleid).name + " :: " + message.guild.roles.get(r.roleid).id + "\n");
                    });
                    let embed = new Discord.MessageEmbed()
                        .setTitle(`Auto roles for ${message.guild.name}`)
                        .setDescription(x)
                        .setColor(0x00FFFF)
                        .setTimestamp();
                    client.editMsg(sMessage, embed, message);
                } else { // If no valid argument
                    client.editMsg(sMessage, `You need to put a valid argument! (Eg. ${PREFIX}autorole remove) There are add, remove, clear, and list.`, message);
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
                autorole(msgToEdit);
            } else {
                autorole(message);
            }
        } catch (e) { // Error >:)
            let rollbar = new client.Rollbar(client.rollbarKey);
            // Sends error info to rollbar
            rollbar.error("Something went wrong in autorole.js", e.stack);
            console.error(e);
            message.channel.send(`Something went wrong while executing the command: \`${PREFIX}autorole\`\n\n\`\`\`xl\n${e}\n\`\`\``);
        }
    },
    jyguyOnly: 0,
    category: "moderation"
}