module.exports = {
    help: "Sets a permission for a role! **All permissions are custom, and the actual role's permissions won't be accounted for, unless the member is the owner of the server. All permissions are saved in a database, and can be updated using this command.** (misc.setperm Required) `Usage: ?setperm <Permission Name> <Role Mention or ID> <true or false>`",
    func: async (client, message, args, unknownCommand, mess, sql, Discord, fs, PREFIX, bool) => {
            try {
                async function setpermcmd(sMessage) {
                    // Checks for the custom permission
                    let bool3 = false;
                    let i = 0;
                    let prom = new Promise((resolve, reject) => {
                        message.member.roles.forEach(async role => {
                            let row = await sql.get('SELECT * FROM permissions WHERE roleID = ? AND pName = ? AND pCategory = ?', [role.id, "setperm", "misc"]);
                            if ((row && row.bool) || message.member === message.guild.owner)
                                bool3 = true;
                            i++;
                            if (i === message.member.roles.size) {
                                setTimeout(resolve, 10);
                            }
                        });
                    });
                    await prom;
                    if (!bool3) return client.editMsg(sMessage, ":x:, Sorry, but you do not have the `misc.setperm` permission.", message);
                    let permission = args[1];
                    if (!permission) return client.editMsg(sMessage, "You have to include a permission name!", message);
                    let category = permission.split('.')[0] ? permission.split('.')[0].toLowerCase() : null;
                    if (!client.permissions[category] && category !== "*") return client.editMsg(sMessage, "That category is not valid!", message);
                    let name = permission.split('.')[1] ? permission.split('.')[1].toLowerCase() : true;
                    if (category !== "*" && !client.permissions[category].includes(name) && name !== true) return client.editMsg(sMessage, "That name is not valid!", message);
                    let role = message.guild.roles.get(args[2] ? args[2].replace(/[<>@&]/g, "") : null);
                    if (!role) return client.editMsg(sMessage, "You have to mention or supply a valid role ID! (Use the guild ID for `everyone`.)", message);
                    if (role.position >= message.member.roles.highest.position && message.member !== message.guild.owner) return client.editMsg(sMessage, "Your role position is not high enough for that role!", message);
                    let bool2 = args[3];
                    if (!bool2) return client.editMsg(sMessage, "Please supply `true` or `false` for the third argument.", message);
                    let choices = [
                        "true",
                        "false"
                    ];
                    if (!choices.includes(bool2.toLowerCase())) return client.editMsg(sMessage, "Please supply `true` or `false` for the third argument.", message);
                    bool2 = bool2.toLowerCase() === "true" ? 1 : 0;
                    if (category === '*') {
                        for (let key in client.permissions) {
                            if (client.permissions.hasOwnProperty(key)) {
                                client.permissions[key].forEach(async p => {
                                    let row2 = await sql.get('SELECT * FROM permissions WHERE roleID = ? AND pCategory = ? AND pName = ?', [role.id, key, p]);
                                    if (row2) {
                                        sql.run('UPDATE permissions SET bool = ? WHERE roleID = ? AND pCategory = ? AND pName = ?', [bool2, role.id, key, p]);
                                    } else {
                                        sql.run('INSERT INTO permissions (roleID, pCategory, pName, bool) VALUES (?, ?, ?, ?)', [role.id, key, p, bool2]);
                                    }
                                });
                            }
                        }
                        client.editMsg(sMessage, `Successfully changed all of ${role.name}'s permissions to ${bool2 ? "true" : "false"}.`, message);
                    } else if (name === true) {
                        client.permissions[category].forEach(async perm => {
                            let row2 = await sql.get(`SELECT * FROM permissions WHERE roleID = ? AND pCategory = ? AND pName = ?`, [role.id, category, perm]);
                            if (row2) {
                                sql.run("UPDATE permissions SET bool = ? WHERE roleID = ? AND pCategory = ? AND pName = ?", [bool2, role.id, category, perm]);
                            } else {
                                sql.run("INSERT INTO permissions (roleID, pCategory, pName, bool) VALUES (?, ?, ?, ?)", [role.id, category, perm, bool2]);
                            }
                        });
                        client.editMsg(sMessage, `Successfully changed ${role.name}'s ${category} permissions to ${bool2 ? "true" : 'false'}.`, message);
                    } else {
                        let row2 = await sql.get('SELECT * FROM permissions WHERE roleID = ? AND pCategory = ? AND pName = ?', [role.id, category, name]);
                        if (!row2) {
                            if (bool2 === 0) return client.editMsg(sMessage, "That role is already set to that!", message);
                            sql.run("INSERT INTO permissions (roleID, pCategory, pName, bool) VALUES (?, ?, ?, ?)", [role.id, category, name, bool2]);
                            client.editMsg(sMessage, "Successfully updated that role's permission.", message);
                        } else {
                            if (row2.bool === bool2) return client.editMsg(sMessage, "That role is already set to that!", message);
                            sql.run("UPDATE permissions SET bool = ? WHERE roleID = ? AND pCategory = ? AND pName = ?", [bool2, role.id, category, name]);
                            client.editMsg(sMessage, "Successfully updated that role's permission.", message);
                        }
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
                    setpermcmd(msgToEdit);
                } else {
                    setpermcmd(message);
                }
            } catch (e) {
                message.channel.send(`Something went wrong while executing the command: \`${PREFIX}setperm\`\n\n\`\`\`xl\n${e}\n\`\`\``);
                console.error(e);
            }
        },
        jyguyOnly: 0,
        category: "misc"
}