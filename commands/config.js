module.exports = {
    help: "Toggles certain options. (Various Permissions Required) `Usage: ?config <Config Option> <Value>`",
    func: async (client, message, args, unknownCommand, mess, sql, Discord, fs, PREFIX, bool) => {
            try {
                async function config(sMessage) {
                    let option = args[1] ? args[1].toLowerCase() : null;
                    let options = [
                        "togglelog",
                        "togglelevel",
                        "cmdnotfound",
                        "togglewelcome",
                        "welcomemsg",
                        "goodbyemsg",
                        "welcomechannel",
                        'prefix',
                        "cooldownmsg",
                        "blacklistmsg",
                        "logchannel",
                        "welcomepic",
                        "togglestar",
                        "starchannel",
                        "updatechannel",
                        "deleteinvite"
                    ];
                    if (!option) return client.editMsg(sMessage, "The valid options are:\n`togglelog, logchannel, togglelevel, cmdnotfound, togglewelcome, welcomemsg, welcomepic, goodbyemsg, welcomechannel, prefix, cooldownmsg, blacklistmsg, togglestar, starchannel, updatechannel, and deleteinvite.`", message);
                    if (!options.includes(option)) return client.editMsg(sMessage, "That is not a valid option!", message);
                    if (option === options[0]) { // togglelog
                        // Checks for the custom permission
                        let bool2 = false;
                        let i = 0;
                        let prom = new Promise(resolve => {
                            message.member.roles.forEach(async role => {
                                let row2 = (await sql.query(`SELECT * FROM permissions WHERE roleID = '${role.id}' AND pName = 'log' AND pCategory = 'mod'`)).rows[0];
                                if ((row2 && row2.bool) || message.member === message.guild.owner)
                                    bool2 = true;
                                i++;
                                if (i === message.member.roles.size)
                                    setTimeout(resolve, 10);
                            });
                        });
                        await prom;
                        if (!bool2) return client.editMsg(sMessage, ":x:, Sorry, but you do not have the `mod.log` permission.", message);
                        let row = (await sql.query(`SELECT * FROM actionlog WHERE guildId = '${message.guild.id}'`)).rows[0];
                        let bool;
                        if (!args[2]) bool = row ? (row.bool ? 0 : 1) : 1;
                        else {
                            if (args[2].toLowerCase() !== "false" && args[2].toLowerCase() !== "true") return client.editMsg(sMessage, "An invalid argument has been provided, please use `false` or `true`.", message);
                            bool = args[2] === "false" ? 0 : 1;
                        }
                        if (!row) {
                            if (bool === 0) return client.editMsg(sMessage, "The value you inputted is already active!", message);
                            sql.query(`INSERT INTO actionlog (guildId, bool) VALUES ('${message.guild.id}', ${bool})`);
                            client.editMsg(sMessage, `Successfully updated \`togglelog\` to \`${bool ? "true" : "false"}\`.`, message);
                        } else {
                            if (row.bool === bool) return client.editMsg(sMessage, "The value you inputted is already active!", message);
                            sql.query(`UPDATE actionlog SET bool = ${bool} WHERE guildId = '${message.guild.id}'`);
                            client.editMsg(sMessage, `Successfully updated \`togglelog\` to \`${bool ? "true" : "false"}\`.`, message);
                        }
                    } else if (option === options[1]) { // togglelevel
                        // Checks for the custom permission
                        let bool2 = false;
                        let i = 0;
                        let prom = new Promise(resolve => {
                            message.member.roles.forEach(async role => {
                                let row2 = (await sql.query(`SELECT * FROM permissions WHERE roleID = '${role.id}' AND pName = 'options' AND pCategory = 'level'`)).rows[0];
                                if ((row2 && row2.bool) || message.member === message.guild.owner)
                                    bool2 = true;
                                i++;
                                if (i === message.member.roles.size)
                                    setTimeout(resolve, 10);
                            });
                        });
                        await prom;
                        if (!bool2) return client.editMsg(sMessage, ":x:, Sorry, but you do not have the `level.options` permission.", message);

                        let row = (await sql.query(`SELECT * FROM toggleLevel WHERE guildId = '${message.guild.id}'`)).rows[0];
                        let bool;
                        if (!args[2]) bool = row ? (row.bool ? 0 : 1) : 1;
                        else {
                            if (args[2].toLowerCase() !== "false" && args[2].toLowerCase() !== "true") return client.editMsg(sMessage, "An invalid argument has been provided, please use `false` or `true`.", message);
                            bool = args[2] === "false" ? 0 : 1;
                        }
                        if (!row) {
                            if (bool === 0) return client.editMsg(sMessage, "The value you inputted is already active!", message);
                            sql.query(`INSERT INTO toggleLevel (guildId, bool) VALUES ('${message.guild.id}', ${bool})`);
                            client.editMsg(sMessage, `Successfully updated \`togglelevel\` to \`${bool ? "true" : "false"}\`.`, message);
                        } else {
                            if (row.bool === bool) return client.editMsg(sMessage, "The value you inputted is already active!", message);
                            sql.query(`UPDATE toggleLevel SET bool = ${bool} WHERE guildId = '${message.guild.id}'`);
                            client.editMsg(sMessage, `Successfully updated \`togglelevel\` to \`${bool ? "true" : "false"}\`.`, message);
                        }
                    } else if (option === options[2]) { // cmdnotfound
                        // Checks for the custom permission
                        let bool2 = false;
                        let i = 0;
                        let prom = new Promise(resolve => {
                            message.member.roles.forEach(async role => {
                                let row2 = (await sql.query(`SELECT * FROM permissions WHERE roleID = '${role.id}' AND pName = 'togglemsg' AND pCategory = 'misc'`)).rows[0];
                                if ((row2 && row2.bool) || message.member === message.guild.owner)
                                    bool2 = true;
                                i++;
                                if (i === message.member.roles.size)
                                    setTimeout(resolve, 10);
                            });
                        });
                        await prom;
                        if (!bool2) return client.editMsg(sMessage, ":x:, Sorry, but you do not have the `misc.togglemsg` permission.", message);

                        let row = (await sql.query(`SELECT * FROM cmdnotfound WHERE guildId = '${message.guild.id}'`)).rows[0];
                        let bool;
                        if (!args[2]) bool = row ? (row.bool ? 0 : 1) : 1;
                        else {
                            if (args[2].toLowerCase() !== "false" && args[2].toLowerCase() !== "true") return client.editMsg(sMessage, "An invalid argument has been provided, please use `false` or `true`.", message);
                            bool = args[2] === "false" ? 0 : 1;
                        }
                        if (!row) {
                            if (bool === 1) return client.editMsg(sMessage, "The value you inputted is already active!", message);
                            sql.query(`INSERT INTO cmdnotfound (guildId, bool) VALUES ('${message.guild.id}', ${bool})`);
                            client.editMsg(sMessage, `Successfully updated \`cmdnotfound\` to \`${bool ? "true" : "false"}\`.`, message);
                        } else {
                            if (row.bool === bool) return client.editMsg(sMessage, "The value you inputted is already active!", message);
                            sql.query(`UPDATE cmdnotfound SET bool = ${bool} WHERE guildId = '${message.guild.id}'`);
                            client.editMsg(sMessage, `Successfully updated \`cmdnotfound\` to \`${bool ? "true" : "false"}\`.`, message);
                        }
                    } else if (option === options[3]) { // togglewelcome
                        // Checks for the custom permission
                        let bool2 = false;
                        let i = 0;
                        let prom = new Promise(resolve => {
                            message.member.roles.forEach(async role => {
                                let row2 = (await sql.query(`SELECT * FROM permissions WHERE roleID = '${role.id}' AND pName = 'welcome' AND pCategory = 'misc'`)).rows[0];
                                if ((row2 && row2.bool) || message.member === message.guild.owner)
                                    bool2 = true;
                                i++;
                                if (i === message.member.roles.size)
                                    setTimeout(resolve, 10);
                            });
                        });
                        await prom;
                        if (!bool2) return client.editMsg(sMessage, ":x:, Sorry, but you do not have the `misc.welcome` permission.", message);
                        let row = (await sql.query(`SELECT * FROM toggleWelcome WHERE guildId = '${message.guild.id}'`)).rows[0];
                        let bool;
                        if (!args[2]) bool = row ? (row.bool ? 0 : 1) : 1;
                        else {
                            if (args[2].toLowerCase() !== "false" && args[2].toLowerCase() !== "true") return client.editMsg(sMessage, "An invalid argument has been provided, please use `false` or `true`.", message);
                            bool = args[2] === "false" ? 0 : 1;
                        }
                        if (!row) {
                            if (bool === 0) return client.editMsg(sMessage, "The value you inputted is already active!", message);
                            sql.query(`INSERT INTO toggleWelcome (guildId, bool) VALUES ('${message.guild.id}', ${bool})`);
                            client.editMsg(sMessage, `Successfully updated \`togglewelcome\` to \`${bool ? "true" : "false"}\`.`, message);
                        } else {
                            if (row.bool === bool) return client.editMsg(sMessage, "The value you inputted is already active!", message);
                            sql.query(`UPDATE toggleWelcome SET bool = ${bool} WHERE guildId = '${message.guild.id}'`);
                            client.editMsg(sMessage, `Successfully updated \`togglewelcome\` to \`${bool ? "true" : "false"}\`.`, message);
                        }
                    } else if (option === options[4]) { // welcomemsg
                        // Checks for the custom permission
                        let bool2 = false;
                        let i = 0;
                        let prom = new Promise(resolve => {
                            message.member.roles.forEach(async role => {
                                let row2 = (await sql.query(`SELECT * FROM permissions WHERE roleID = '${role.id}' AND pName = 'welcome' AND pCategory = 'misc'`)).rows[0];
                                if ((row2 && row2.bool) || message.member === message.guild.owner)
                                    bool2 = true;
                                i++;
                                if (i === message.member.roles.size)
                                    setTimeout(resolve, 10);
                            });
                        });
                        await prom;
                        if (!bool2) return client.editMsg(sMessage, ":x:, Sorry, but you do not have the `misc.welcome` permission.", message);
                        let row = (await sql.query(`SELECT * FROM customMessages WHERE guildId = '${message.guild.id}'`)).rows[0];
                        let msg = args.slice(2).join(' ');
                        if (!msg) return client.editMsg(sMessage, row ? `\`${row.customMessage}\` is the current welcoming message for this server!` : "This server uses the default welcoming message!", message);
                        if (msg.length > 1000) return client.editMsg(sMessage, 'Please keep the length under a thousand characters.', message);
                        if (!row) {
                            if (msg.toLowerCase() === "reset") {
                                sql.query(`DELETE FROM customMessages WHERE guildId = '${message.guild.id}'`);
                                client.editMsg(sMessage, `Successfully reset \`welcomemsg\`.`, message);
                            } else {
                                sql.query(`INSERT INTO customMessages (guildId, customMessage) VALUES ('${message.guild.id}', '${client.escape(msg)}')`);
                                client.editMsg(sMessage, `Successfully updated \`welcomemsg\` to \`${msg}\`.`, message);
                            }
                        } else {
                            if (row.customMessage === msg) return client.editMsg(sMessage, "The value you inputted is already active!", message);
                            sql.query(`UPDATE customMessages SET customMessage = '${client.escape(msg)}' WHERE guildId = '${message.guild.id}'`);
                            client.editMsg(sMessage, `Successfully updated \`welcomemsg\` to \`${msg}\`.`, message);
                        }
                    } else if (option === options[5]) { // goodbyemsg
                        // Checks for the custom permission
                        let bool2 = false;
                        let i = 0;
                        let prom = new Promise(resolve => {
                            message.member.roles.forEach(async role => {
                                let row2 = (await sql.query(`SELECT * FROM permissions WHERE roleID = '${role.id}' AND pName = 'welcome' AND pCategory = 'misc'`)).rows[0];
                                if ((row2 && row2.bool) || message.member === message.guild.owner)
                                    bool2 = true;
                                i++;
                                if (i === message.member.roles.size)
                                    setTimeout(resolve, 10);
                            });
                        });
                        await prom;
                        if (!bool2) return client.editMsg(sMessage, ":x:, Sorry, but you do not have the `misc.welcome` permission.", message);
                        let row = (await sql.query(`SELECT bool FROM goodbyeMessages WHERE guildId = '${message.guild.id}'`)).rows[0];
                        let msg = args.slice(2).join(' ');
                        if (!msg) return client.editMsg(sMessage, row ? `\`${row.customMessage}\` is the current goodbye message for this server!` : "This server uses the default goodbye message!", message);
                        if (msg.length > 1000) return client.editMsg(sMessage, 'Please keep the length under a thousand characters.', message);
                        if (!row) {
                            sql.query(`INSERT INTO goodbyeMessages (guildId, customMessage) VALUES ('${message.guild.id}', '${client.escape(msg)}')`);
                            client.editMsg(sMessage, `Successfully updated \`goodbyemsg\` to \`${msg}\`.`, message);
                        } else {
                            if (row.bool === bool) return client.editMsg(sMessage, "The value you inputted is already active!", message);
                            sql.query(`UPDATE goodbyeMessages SET customMessage = '${client.escape(msg)}' WHERE guildId = '${message.guild.id}'`);
                            client.editMsg(sMessage, `Successfully updated \`goodbyemsg\` to \`${msg}\`.`, message);
                        }
                    } else if (option === options[6]) { // welcomechannel
                        // Checks for the custom permission
                        let bool2 = false;
                        let i = 0;
                        let prom = new Promise(resolve => {
                            message.member.roles.forEach(async role => {
                                let row3 = (await sql.query(`SELECT * FROM permissions WHERE roleID = '${role.id}' AND pName = 'welcome' AND pCategory = 'misc'`)).rows[0];
                                if ((row3 && row3.bool) || message.member === message.guild.owner)
                                    bool2 = true;
                                i++;
                                if (i === message.member.roles.size)
                                    setTimeout(resolve, 10);
                            });
                        });
                        await prom;
                        if (!bool2) return client.editMsg(sMessage, ":x:, Sorry, but you do not have the `misc.welcome` permission.", message);
                        let row = (await sql.query(`SELECT * FROM welcomeChannel WHERE guildId = '${message.guild.id}'`)).rows[0];
                        let row2 = (await sql.query(`SELECT bool FROM toggleWelcome WHERE guildId = '${message.guild.id}'`)).rows[0];
                        let selectedChannel = message.guild.channels.get(args[2] ? args[2].replace(/[<>#]/g, "") : null);
                        if (!selectedChannel) return client.editMsg(sMessage, row ? `${message.guild.channels.get(row.channel) ? message.guild.channels.get(row.channel) : "`None`"} is the current welcoming channel for this server!` : "This server uses the default welcoming channel!", message);
                        if (!row2 || !row2.bool) return client.editMsg(sMessage, `This server has welcoming messages disabled! Use \`${PREFIX}config welcome true\` to turn it back on.`, message);
                        if (row) {
                            if (row.channel === selectedChannel.id) return client.editMsg(sMessage, "The value you inputted is already active!", message);
                            sql.query(`UPDATE welcomeChannel SET channel = '${selectedChannel.id}' WHERE guildId = '${message.guild.id}'`);
                            client.editMsg(sMessage, `Successfully updated \`welcomechannel\` to ${selectedChannel}.`, message);
                        } else {
                            sql.query(`INSERT INTO welcomeChannel (guildId, channel) VALUES ('${message.guild.id}', '${selectedChannel.id}')`);
                            client.editMsg(sMessage, `Successfully updated \`welcomechannel\` to ${selectedChannel}.`, message);
                        }
                    } else if (option === options[7]) { // prefix
                        // Checks for the custom permission
                        let bool2 = false;
                        let i = 0;
                        let prom = new Promise(resolve => {
                            message.member.roles.forEach(async role => {
                                let row2 = (await sql.query(`SELECT * FROM permissions WHERE roleID = '${role.id}' AND pName = 'prefix' AND pCategory = 'misc'`)).rows[0];
                                if ((row2 && row2.bool) || message.member === message.guild.owner)
                                    bool2 = true;
                                i++;
                                if (i === message.member.roles.size)
                                    setTimeout(resolve, 10);
                            });
                        });
                        await prom;
                        if (!bool2) return client.editMsg(sMessage, ":x:, Sorry, but you do not have the `misc.prefix` permission.", message);
                        let prefix = args.slice(2).join(' ');
                        if (!prefix) return client.editMsg(sMessage, "Please provide a prefix for me to set in this server.", message);
                        if (prefix.length > 15) return client.editMsg(sMessage, "The prefix may not exceed 15 characters!", message);
                        let row = (await sql.query(`SELECT * FROM prefix WHERE guildId = '${message.guild.id}'`)).rows[0];
                        if (row && row.customPrefix === prefix) return client.editMsg(sMessage, "This server's prefix is already set to `" + prefix + "`!", message);
                        if (row) {
                            sql.query(`UPDATE prefix SET customPrefix = $1 WHERE guildId = $2`, [prefix, message.guild.id]);
                            client.editMsg(sMessage, `Successfully updated \`prefix\` to \`${prefix}\`.`, message);
                        } else {
                            sql.query(`INSERT INTO prefix (guildId, customPrefix) VALUES ($1, $2)`, [message.guild.id, prefix]);
                            client.editMsg(sMessage, `Successfully updated \`prefix\` to \`${prefix}\`.`, message);
                        }
                    } else if (option === options[8]) { // cooldownmsg
                        // Checks for the custom permission
                        let bool2 = false;
                        let i = 0;
                        let prom = new Promise(resolve => {
                            message.member.roles.forEach(async role => {
                                let row2 = (await sql.query(`SELECT * FROM permissions WHERE roleID = '${role.id}' AND pName = 'cooldownmsg' AND pCategory = 'misc'`)).rows[0];
                                if ((row2 && row2.bool) || message.member === message.guild.owner)
                                    bool2 = true;
                                i++;
                                if (i === message.member.roles.size)
                                    setTimeout(resolve, 10);
                            });
                        });
                        await prom;
                        if (!bool2) return client.editMsg(sMessage, ":x:, Sorry, but you do not have the `misc.cooldownmsg` permission.", message);
                        let row = (await sql.query(`SELECT * FROM cooldownmsg WHERE guildId = '${message.guild.id}'`)).rows[0];
                        let bool;
                        if (!args[2]) bool = row ? (row.bool ? 0 : 1) : 1;
                        else {
                            if (args[2].toLowerCase() !== "false" && args[2].toLowerCase() !== "true") return client.editMsg(sMessage, "An invalid argument has been provided, please use `false` or `true`.", message);
                            bool = args[2] === "false" ? 0 : 1;
                        }
                        if (!row) {
                            if (bool === 0) return client.editMsg(sMessage, "The value you inputted is already active!", message);
                            sql.query(`INSERT INTO cooldownmsg (guildId, bool) VALUES ('${message.guild.id}', ${bool})`);
                            client.editMsg(sMessage, `Successfully updated \`cooldownmsg\` to \`${bool ? "true" : "false"}\`.`, message);
                        } else {
                            if (row.bool === bool) return client.editMsg(sMessage, "The value you inputted is already active!", message);
                            sql.query(`UPDATE cooldownmsg SET bool = ${bool} WHERE guildId = '${message.guild.id}'`);
                            client.editMsg(sMessage, `Successfully updated \`cooldownmsg\` to \`${bool ? "true" : "false"}\`.`, message);
                        }
                    } else if (option === options[9]) { // blacklistmsg
                        // Checks for the custom permission
                        let bool2 = false;
                        let i = 0;
                        let prom = new Promise(resolve => {
                            message.member.roles.forEach(async role => {
                                let row2 = (await sql.query(`SELECT * FROM permissions WHERE roleID = '${role.id}' AND pName = 'blacklist' AND pCategory = 'misc'`)).rows[0];
                                if ((row2 && row2.bool) || message.member === message.guild.owner)
                                    bool2 = true;
                                i++;
                                if (i === message.member.roles.size)
                                    setTimeout(resolve, 10);
                            });
                        });
                        await prom;
                        if (!bool2) return client.editMsg(sMessage, ":x:, Sorry, but you do not have the `misc.blacklist` permission.", message);
                        let row = (await sql.query(`SELECT * FROM blacklistmsg WHERE guildId = '${message.guild.id}'`)).rows[0];
                        let bool;
                        if (!args[2]) bool = row ? (row.bool ? 0 : 1) : 0;
                        else {
                            if (args[2].toLowerCase() !== "false" && args[2].toLowerCase() !== "true") return client.editMsg(sMessage, "An invalid argument has been provided, please use `false` or `true`.", message);
                            bool = args[2] === "false" ? 0 : 1;
                        }
                        if (!row) {
                            if (bool === 1) return client.editMsg(sMessage, "The value you inputted is already active!", message);
                            sql.query(`INSERT INTO blacklistmsg (guildId, bool) VALUES ('${message.guild.id}', ${bool})`);
                            client.editMsg(sMessage, `Successfully updated \`blacklistmsg\` to \`${bool ? "true" : "false"}\`.`, message);
                        } else {
                            if (row.bool === bool) return client.editMsg(sMessage, "The value you inputted is already active!", message);
                            sql.query(`UPDATE blacklistmsg SET bool = ${bool} WHERE guildId = '${message.guild.id}'`);
                            client.editMsg(sMessage, `Successfully updated \`blacklistmsg\` to \`${bool ? "true" : "false"}\`.`, message);
                        }
                    } else if (option === options[10]) { // logchannel
                        // Checks for the custom permission
                        let bool2 = false;
                        let i = 0;
                        let prom = new Promise(resolve => {
                            message.member.roles.forEach(async role => {
                                let row3 = (await sql.query(`SELECT * FROM permissions WHERE roleID = '${role.id}' AND pName = 'log' AND pCategory = 'mod'`)).rows[0];
                                if ((row3 && row3.bool) || message.member === message.guild.owner)
                                    bool2 = true;
                                i++;
                                if (i === message.member.roles.size)
                                    setTimeout(resolve, 10);
                            });
                        });
                        await prom;
                        if (!bool2) return client.editMsg(sMessage, ":x:, Sorry, but you do not have the `mod.log` permission.", message);
                        let selectedChannel = message.guild.channels.get(args[2] ? args[2].replace(/[<>#]/g, "") : null);
                        let row = (await sql.query(`SELECT * FROM logChannel WHERE guildId = '${message.guild.id}'`)).rows[0];
                        let row2 = (await sql.query(`SELECT * FROM actionlog WHERE guildId = '${message.guild.id}'`)).rows[0];
                        if (!selectedChannel) return client.editMsg(sMessage, row ? `${message.guild.channels.get(row.channelId) ? message.guild.channels.get(row.channelId) : "`None`"} is the current log channel for this server!` : "This server uses the default log channel!", message);
                        if (!row2 || !row2.bool) return client.editMsg(sMessage, `This server has logs disabled! Use \`${PREFIX}config togglelog true\` to turn it back on.`, message);
                        if (row) {
                            if (row.channelId === selectedChannel.id) return client.editMsg(sMessage, "The value you inputted is already active!", message);
                            sql.query(`UPDATE logChannel SET channelId = '${selectedChannel.id}' WHERE guildId = '${message.guild.id}'`);
                            client.editMsg(sMessage, `Successfully updated \`logchannel\` to ${selectedChannel}.`, message);
                        } else {
                            sql.query(`INSERT INTO logChannel (guildId, channelId) VALUES ('${message.guild.id}', '${selectedChannel.id}')`);
                            client.editMsg(sMessage, `Successfully updated \`logchannel\` to ${selectedChannel}.`, message);
                        }
                    } else if (option === options[11]) { // welcomepic
                        // Checks for the custom permission
                        let bool2 = false;
                        let i = 0;
                        let prom = new Promise(resolve => {
                            message.member.roles.forEach(async role => {
                                let row2 = (await sql.query(`SELECT * FROM permissions WHERE roleID = '${role.id}' AND pName = 'welcome' AND pCategory = 'misc'`)).rows[0];
                                if ((row2 && row2.bool) || message.member === message.guild.owner)
                                    bool2 = true;
                                i++;
                                if (i === message.member.roles.size)
                                    setTimeout(resolve, 10);
                            });
                        });
                        await prom;
                        if (!bool2) return client.editMsg(sMessage, ":x:, Sorry, but you do not have the `misc.welcome` permission.", message);
                        let row = (await sql.query(`SELECT * FROM picwelcome WHERE guildId = '${message.guild.id}'`)).rows[0];
                        let bool;
                        if (!args[2]) bool = row ? (row.bool ? 0 : 1) : 0;
                        else {
                            if (args[2].toLowerCase() !== "false" && args[2].toLowerCase() !== "true") return client.editMsg(sMessage, "An invalid argument has been provided, please use `false` or `true`.", message);
                            bool = args[2] === "false" ? 0 : 1;
                        }
                        if (!row) {
                            if (bool === 1) return client.editMsg(sMessage, "The value you inputted is already active!", message);
                            sql.query(`INSERT INTO picwelcome (guildId, bool) VALUES ('${message.guild.id}', ${bool})`);
                            client.editMsg(sMessage, `Successfully updated \`welcomepic\` to \`${bool ? "true" : "false"}\`.`, message);
                        } else {
                            if (row.bool === bool) return client.editMsg(sMessage, "The value you inputted is already active!", message);
                            sql.query(`UPDATE picwelcome SET bool = ${bool} WHERE guildId = '${message.guild.id}'`);
                            client.editMsg(sMessage, `Successfully updated \`welcomepic\` to \`${bool ? "true" : "false"}\`.`, message);
                        }
                    } else if (option === options[12]) { // togglestar
                        // Checks for the custom permission
                        let bool2 = false;
                        let i = 0;
                        let prom = new Promise(resolve => {
                            message.member.roles.forEach(async role => {
                                let row2 = (await sql.query(`SELECT * FROM permissions WHERE roleID = '${role.id}' AND pName = 'star' AND pCategory = 'misc'`)).rows[0];
                                if ((row2 && row2.bool) || message.member === message.guild.owner)
                                    bool2 = true;
                                i++;
                                if (i === message.member.roles.size)
                                    setTimeout(resolve, 10);
                            });
                        });
                        await prom;
                        if (!bool2) return client.editMsg(sMessage, ":x:, Sorry, but you do not have the `misc.star` permission.", message);
                        let row = (await sql.query(`SELECT * FROM togglestar WHERE guildId = '${message.guild.id}'`)).rows[0];
                        let bool;
                        if (!args[2]) bool = row ? (row.bool ? 0 : 1) : 1;
                        else {
                            if (args[2].toLowerCase() !== "false" && args[2].toLowerCase() !== "true") return client.editMsg(sMessage, "An invalid argument has been provided, please use `false` or `true`.", message);
                            bool = args[2] === "false" ? 0 : 1;
                        }
                        if (!row) {
                            if (bool === 0) return client.editMsg(sMessage, "The value you inputted is already active!", message);
                            sql.query(`INSERT INTO togglestar (guildId, bool) VALUES ('${message.guild.id}', ${bool})`);
                            client.editMsg(sMessage, `Successfully updated \`togglestar\` to \`${bool ? "true" : "false"}\`.`, message);
                        } else {
                            if (row.bool === bool) return client.editMsg(sMessage, "The value you inputted is already active!", message);
                            sql.query(`UPDATE togglestar SET bool = ${bool} WHERE guildId = '${message.guild.id}'`);
                            client.editMsg(sMessage, `Successfully updated \`togglestar\` to \`${bool ? "true" : "false"}\`.`, message);
                        }
                    } else if (option === options[13]) { // starchannel
                        // Checks for the custom permission
                        let bool2 = false;
                        let i = 0;
                        let prom = new Promise(resolve => {
                            message.member.roles.forEach(async role => {
                                let row3 = (await sql.query(`SELECT * FROM permissions WHERE roleID = '${role.id}' AND pName = 'star' AND pCategory = 'misc'`)).rows[0];
                                if ((row3 && row3.bool) || message.member === message.guild.owner)
                                    bool2 = true;
                                i++;
                                if (i === message.member.roles.size)
                                    setTimeout(resolve, 10);
                            });
                        });
                        await prom;
                        if (!bool2) return client.editMsg(sMessage, ":x:, Sorry, but you do not have the `misc.star` permission.", message);
                        let selectedChannel = message.guild.channels.get(args[2] ? args[2].replace(/[<>#]/g, "") : null);
                        let row = (await sql.query(`SELECT * FROM starchannel WHERE guildId = '${message.guild.id}'`)).rows[0];
                        let row2 = (await sql.query(`SELECT * FROM togglestar WHERE guildId = '${message.guild.id}'`)).rows[0];
                        if (!selectedChannel) return client.editMsg(sMessage, row ? `${message.guild.channels.get(row.channelId) ? message.guild.channels.get(row.channelId) : "`None`"} is the current starboard channel for this server!` : "This server uses the default starboard channel!", message);
                        if (row2 && !row2.bool) return client.editMsg(sMessage, `This server has starboard disabled! Use \`${PREFIX}config togglestar true\` to turn it back on.`, message);
                        if (row) {
                            if (row.channelId === selectedChannel.id) return client.editMsg(sMessage, "The value you inputted is already active!", message);
                            sql.query(`UPDATE starchannel SET channel = '${selectedChannel.id}' WHERE guildId = '${message.guild.id}'`);
                            client.editMsg(sMessage, `Successfully updated \`starchannel\` to ${selectedChannel}.`, message);
                        } else {
                            sql.query(`INSERT INTO starchannel (guildId, channelId) VALUES ('${message.guild.id}', '${selectedChannel.id}')`);
                            client.editMsg(sMessage, `Successfully updated \`starchannel\` to ${selectedChannel}.`, message);
                        }
                    } else if (option === options[14]) { // updatechannel
                        // Checks for the custom permission
                        let bool2 = false;
                        let i = 0;
                        let prom = new Promise(resolve => {
                            message.member.roles.forEach(async role => {
                                let row3 = (await sql.query(`SELECT * FROM permissions WHERE roleID = '${role.id}' AND pName = 'update' AND pCategory = 'misc'`)).rows[0];
                                if ((row3 && row3.bool) || message.member === message.guild.owner)
                                    bool2 = true;
                                i++;
                                if (i === message.member.roles.size)
                                    setTimeout(resolve, 10);
                            });
                        });
                        await prom;
                        if (!bool2) return client.editMsg(sMessage, ":x:, Sorry, but you do not have the `misc.update` permission.", message);
                        let selectedChannel = message.guild.channels.get(args[2] ? args[2].replace(/[<>#]/g, "") : null);
                        let row = (await sql.query(`SELECT * FROM updatechannel WHERE guildID = '${message.guild.id}'`)).rows[0];
                        if (!selectedChannel) return client.editMsg(sMessage, row ? `${message.guild.channels.get(row.channelID) ? message.guild.channels.get(row.channelID) : "`None`"} is the current update channel for this server!` : "This server does not use an update channel!", message);
                        if (row) {
                            if (row.channelID === selectedChannel.id) return client.editMsg(sMessage, "The value you inputted is already active!", message);
                            sql.query(`UPDATE updatechannel SET channelID = '${selectedChannel.id}' WHERE guildID = '${message.guild.id}'`);
                            client.editMsg(sMessage, `Successfully updated \`updatechannel\` to ${selectedChannel}.`, message);
                        } else {
                            sql.query(`INSERT INTO updatechannel (guildId, channelId) VALUES ('${message.guild.id}', '${selectedChannel.id}')`);
                            client.editMsg(sMessage, `Successfully updated \`updatechannel\` to ${selectedChannel}.`, message);
                        }
                    } else if (option === options[15]) { // deleteinvite
                        // Checks for the custom permission
                        let bool2 = false;
                        let i = 0;
                        let prom = new Promise(resolve => {
                            message.member.roles.forEach(async role => {
                                let row2 = (await sql.query(`SELECT * FROM permissions WHERE roleID = '${role.id}' AND pName = 'invite' AND pCategory = 'misc'`)).rows[0];
                                if ((row2 && row2.bool) || message.member === message.guild.owner)
                                    bool2 = true;
                                i++;
                                if (i === message.member.roles.size)
                                    setTimeout(resolve, 10);
                            });
                        });
                        await prom;
                        if (!bool2) return client.editMsg(sMessage, ":x:, Sorry, but you do not have the `misc.invite` permission.", message);
                        let row = (await sql.query(`SELECT * FROM deleteinvite WHERE guildId = '${message.guild.id}'`)).rows[0];
                        let bool;
                        if (!args[2]) bool = row ? (row.bool ? 0 : 1) : 1;
                        else {
                            if (args[2].toLowerCase() !== "false" && args[2].toLowerCase() !== "true") return client.editMsg(sMessage, "An invalid argument has been provided, please use `false` or `true`.", message);
                            bool = args[2] === "false" ? 0 : 1;
                        }
                        if (!row) {
                            if (bool === 0) return client.editMsg(sMessage, "The value you inputted is already active!", message);
                            sql.query(`INSERT INTO deleteinvite (guildId, bool) VALUES ('${message.guild.id}', ${bool})`);
                            client.editMsg(sMessage, `Successfully updated \`deleteinvite\` to \`${bool ? "true" : "false"}\`.`, message);
                        } else {
                            if (row.bool === bool) return client.editMsg(sMessage, "The value you inputted is already active!", message);
                            sql.query(`UPDATE deleteinvite SET bool = ${bool} WHERE guildId = '${message.guild.id}'`);
                            client.editMsg(sMessage, `Successfully updated \`deleteinvite\` to \`${bool ? "true" : "false"}\`.`, message);
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
                    config(msgToEdit);
                } else {
                    config(message);
                }
            } catch (e) {
                message.channel.send(`Something went wrong while executing the command: \`${PREFIX}config\`\n\n\`\`\`xl\n${e}\n\`\`\``);
                console.error(e);
            }
        },
        jyguyOnly: 0,
        category: "moderation"
}
