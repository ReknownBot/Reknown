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
                                let row2 = await sql.get('SELECT * FROM permissions WHERE roleID = ? AND pName = ? AND pCategory = ?', [role.id, "log", "mod"]);
                                if ((row2 && row2.bool) || message.member === message.guild.owner)
                                    bool2 = true;
                                i++;
                                if (i === message.member.roles.size)
                                    setTimeout(resolve, 10);
                            });
                        });
                        await prom;
                        if (!bool2) return client.editMsg(sMessage, ":x:, Sorry, but you do not have the `mod.log` permission.", message);
                        let row = await sql.get('SELECT * FROM actionlog WHERE guildId = ?', [message.guild.id]);
                        let bool;
                        if (!args[2]) bool = row ? (row.bool ? 0 : 1) : 1;
                        else {
                            if (args[2].toLowerCase() !== "false" && args[2].toLowerCase() !== "true") return client.editMsg(sMessage, "An invalid argument has been provided, please use `false` or `true`.", message);
                            bool = args[2] === "false" ? 0 : 1;
                        }
                        if (!row) {
                            if (bool === 0) return client.editMsg(sMessage, "The value you inputted is already active!", message);
                            sql.run(`INSERT INTO actionlog (guildId, bool) VALUES (?, ?)`, [message.guild.id, bool]);
                            client.editMsg(sMessage, `Successfully updated \`togglelog\` to \`${bool ? "true" : "false"}\`.`, message);
                        } else {
                            if (row.bool === bool) return client.editMsg(sMessage, "The value you inputted is already active!", message);
                            sql.run(`UPDATE actionlog SET bool = ${bool} WHERE guildId = ${message.guild.id}`);
                            client.editMsg(sMessage, `Successfully updated \`togglelog\` to \`${bool ? "true" : "false"}\`.`, message);
                        }
                    } else if (option === options[1]) { // togglelevel
                        // Checks for the custom permission
                        let bool2 = false;
                        let i = 0;
                        let prom = new Promise(resolve => {
                            message.member.roles.forEach(async role => {
                                let row2 = await sql.get('SELECT * FROM permissions WHERE roleID = ? AND pName = ? AND pCategory = ?', [role.id, "options", "level"]);
                                if ((row2 && row2.bool) || message.member === message.guild.owner)
                                    bool2 = true;
                                i++;
                                if (i === message.member.roles.size)
                                    setTimeout(resolve, 10);
                            });
                        });
                        await prom;
                        if (!bool2) return client.editMsg(sMessage, ":x:, Sorry, but you do not have the `level.options` permission.", message);

                        let row = await sql.get(`SELECT * FROM toggleLevel WHERE guildId = ${message.guild.id}`);
                        let bool;
                        if (!args[2]) bool = row ? (row.bool ? 0 : 1) : 1;
                        else {
                            if (args[2].toLowerCase() !== "false" && args[2].toLowerCase() !== "true") return client.editMsg(sMessage, "An invalid argument has been provided, please use `false` or `true`.", message);
                            bool = args[2] === "false" ? 0 : 1;
                        }
                        if (!row) {
                            if (bool === 0) return client.editMsg(sMessage, "The value you inputted is already active!", message);
                            sql.run(`INSERT INTO toggleLevel (guildId, bool) VALUES (?, ?)`, [message.guild.id, bool]);
                            client.editMsg(sMessage, `Successfully updated \`togglelevel\` to \`${bool ? "true" : "false"}\`.`, message);
                        } else {
                            if (row.bool === bool) return client.editMsg(sMessage, "The value you inputted is already active!", message);
                            sql.run(`UPDATE toggleLevel SET bool = ${bool} WHERE guildId = ${message.guild.id}`);
                            client.editMsg(sMessage, `Successfully updated \`togglelevel\` to \`${bool ? "true" : "false"}\`.`, message);
                        }
                    } else if (option === options[2]) { // cmdnotfound
                        // Checks for the custom permission
                        let bool2 = false;
                        let i = 0;
                        let prom = new Promise(resolve => {
                            message.member.roles.forEach(async role => {
                                let row2 = await sql.get('SELECT * FROM permissions WHERE roleID = ? AND pName = ? AND pCategory = ?', [role.id, "togglemsg", "misc"]);
                                if ((row2 && row2.bool) || message.member === message.guild.owner)
                                    bool2 = true;
                                i++;
                                if (i === message.member.roles.size)
                                    setTimeout(resolve, 10);
                            });
                        });
                        await prom;
                        if (!bool2) return client.editMsg(sMessage, ":x:, Sorry, but you do not have the `misc.togglemsg` permission.", message);

                        let row = await sql.get(`SELECT * FROM cmdnotfound WHERE guildId = ${message.guild.id}`);
                        let bool;
                        if (!args[2]) bool = row ? (row.bool ? 0 : 1) : 1;
                        else {
                            if (args[2].toLowerCase() !== "false" && args[2].toLowerCase() !== "true") return client.editMsg(sMessage, "An invalid argument has been provided, please use `false` or `true`.", message);
                            bool = args[2] === "false" ? 0 : 1;
                        }
                        if (!row) {
                            if (bool === 0) return client.editMsg(sMessage, "The value you inputted is already active!", message);
                            sql.run(`INSERT INTO cmdnotfound (guildId, bool) VALUES (?, ?)`, [message.guild.id, bool]);
                            client.editMsg(sMessage, `Successfully updated \`cmdnotfound\` to \`${bool ? "true" : "false"}\`.`, message);
                        } else {
                            if (row.bool === bool) return client.editMsg(sMessage, "The value you inputted is already active!", message);
                            sql.run(`UPDATE cmdnotfound SET bool = ${bool} WHERE guildId = ${message.guild.id}`);
                            client.editMsg(sMessage, `Successfully updated \`cmdnotfound\` to \`${bool ? "true" : "false"}\`.`, message);
                        }
                    } else if (option === options[3]) { // togglewelcome
                        // Checks for the custom permission
                        let bool2 = false;
                        let i = 0;
                        let prom = new Promise(resolve => {
                            message.member.roles.forEach(async role => {
                                let row2 = await sql.get('SELECT * FROM permissions WHERE roleID = ? AND pName = ? AND pCategory = ?', [role.id, "welcome", "misc"]);
                                if ((row2 && row2.bool) || message.member === message.guild.owner)
                                    bool2 = true;
                                i++;
                                if (i === message.member.roles.size)
                                    setTimeout(resolve, 10);
                            });
                        });
                        await prom;
                        if (!bool2) return client.editMsg(sMessage, ":x:, Sorry, but you do not have the `misc.welcome` permission.", message);
                        let row = await sql.get(`SELECT * FROM toggleWelcome WHERE guildId = ${message.guild.id}`);
                        let bool;
                        if (!args[2]) bool = row ? (row.bool ? 0 : 1) : 1;
                        else {
                            if (args[2].toLowerCase() !== "false" && args[2].toLowerCase() !== "true") return client.editMsg(sMessage, "An invalid argument has been provided, please use `false` or `true`.", message);
                            bool = args[2] === "false" ? 0 : 1;
                        }
                        if (!row) {
                            if (bool === 0) return client.editMsg(sMessage, "The value you inputted is already active!", message);
                            sql.run(`INSERT INTO toggleWelcome (guildId, bool) VALUES (?, ?)`, [message.guild.id, bool]);
                            client.editMsg(sMessage, `Successfully updated \`togglewelcome\` to \`${bool ? "true" : "false"}\`.`, message);
                        } else {
                            if (row.bool === bool) return client.editMsg(sMessage, "The value you inputted is already active!", message);
                            sql.run(`UPDATE toggleWelcome SET bool = ${bool} WHERE guildId = ${message.guild.id}`);
                            client.editMsg(sMessage, `Successfully updated \`togglewelcome\` to \`${bool ? "true" : "false"}\`.`, message);
                        }
                    } else if (option === options[4]) { // welcomemsg
                        // Checks for the custom permission
                        let bool2 = false;
                        let i = 0;
                        let prom = new Promise(resolve => {
                            message.member.roles.forEach(async role => {
                                let row2 = await sql.get('SELECT * FROM permissions WHERE roleID = ? AND pName = ? AND pCategory = ?', [role.id, "welcome", "misc"]);
                                if ((row2 && row2.bool) || message.member === message.guild.owner)
                                    bool2 = true;
                                i++;
                                if (i === message.member.roles.size)
                                    setTimeout(resolve, 10);
                            });
                        });
                        await prom;
                        if (!bool2) return client.editMsg(sMessage, ":x:, Sorry, but you do not have the `misc.welcome` permission.", message);
                        let row = await sql.get(`SELECT * FROM customMessages WHERE guildId = ${message.guild.id}`);
                        let msg = args.slice(2).join(' ');
                        if (!msg) return client.editMsg(sMessage, row ? `\`${row.customMessage}\` is the current welcoming message for this server!` : "This server uses the default welcoming message!", message);
                        if (msg.length > 1000) return client.editMsg(sMessage, 'Please keep the length under a thousand characters.', message);
                        if (!row) {
                            if (msg.toLowerCase() === "reset") {
                                sql.run(`DELETE FROM customMessages WHERE guildId = ?`, [message.guild.id]);
                                client.editMsg(sMessage, `Successfully reset \`welcomemsg\`.`, message);
                            } else {
                                sql.run(`INSERT INTO customMessages (guildId, customMessage) VALUES (?, ?)`, [message.guild.id, msg]);
                                client.editMsg(sMessage, `Successfully updated \`welcomemsg\` to \`${msg}\`.`, message);
                            }
                        } else {
                            if (row.customMessage === msg) return client.editMsg(sMessage, "The value you inputted is already active!", message);
                            sql.run('UPDATE customMessages SET customMessage = ? WHERE guildId = ?', [msg, message.guild.id]);
                            client.editMsg(sMessage, `Successfully updated \`welcomemsg\` to \`${msg}\`.`, message);
                        }
                    } else if (option === options[5]) { // goodbyemsg
                        // Checks for the custom permission
                        let bool2 = false;
                        let i = 0;
                        let prom = new Promise(resolve => {
                            message.member.roles.forEach(async role => {
                                let row2 = await sql.get('SELECT * FROM permissions WHERE roleID = ? AND pName = ? AND pCategory = ?', [role.id, "welcome", "misc"]);
                                if ((row2 && row2.bool) || message.member === message.guild.owner)
                                    bool2 = true;
                                i++;
                                if (i === message.member.roles.size)
                                    setTimeout(resolve, 10);
                            });
                        });
                        await prom;
                        if (!bool2) return client.editMsg(sMessage, ":x:, Sorry, but you do not have the `misc.welcome` permission.", message);
                        let row = await sql.get(`SELECT bool FROM goodbyeMessages WHERE guildId = ${message.guild.id}`);
                        let msg = args.slice(2).join(' ');
                        if (!msg) return client.editMsg(sMessage, row ? `\`${row.customMessage}\` is the current goodbye message for this server!` : "This server uses the default goodbye message!", message);
                        if (msg.length > 1000) return client.editMsg(sMessage, 'Please keep the length under a thousand characters.', message);
                        if (!row) {
                            sql.run(`INSERT INTO goodbyeMessages (guildId, customMessage) VALUES (?, ?)`, [message.guild.id, msg]);
                            client.editMsg(sMessage, `Successfully updated \`goodbyemsg\` to \`${msg}\`.`, message);
                        } else {
                            if (row.bool === bool) return client.editMsg(sMessage, "The value you inputted is already active!", message);
                            sql.run('UPDATE goodbyeMessages SET customMessage = ? WHERE guildId = ?', [msg, message.guild.id]);
                            client.editMsg(sMessage, `Successfully updated \`goodbyemsg\` to \`${msg}\`.`, message);
                        }
                    } else if (option === options[6]) { // welcomechannel
                        // Checks for the custom permission
                        let bool2 = false;
                        let i = 0;
                        let prom = new Promise(resolve => {
                            message.member.roles.forEach(async role => {
                                let row3 = await sql.get('SELECT * FROM permissions WHERE roleID = ? AND pName = ? AND pCategory = ?', [role.id, "welcome", "misc"]);
                                if ((row3 && row3.bool) || message.member === message.guild.owner)
                                    bool2 = true;
                                i++;
                                if (i === message.member.roles.size)
                                    setTimeout(resolve, 10);
                            });
                        });
                        await prom;
                        if (!bool2) return client.editMsg(sMessage, ":x:, Sorry, but you do not have the `misc.welcome` permission.", message);
                        let row = await sql.get(`SELECT * FROM welcomeChannel WHERE guildId = ${message.guild.id}`);
                        let row2 = await sql.get(`SELECT bool FROM toggleWelcome WHERE guildId = ${message.guild.id}`);
                        let selectedChannel = message.guild.channels.get(args[2] ? args[2].replace(/[<>#]/g, "") : null);
                        if (!selectedChannel) return client.editMsg(sMessage, row ? `${message.guild.channels.get(row.channel) ? message.guild.channels.get(row.channel) : "`None`"} is the current welcoming channel for this server!` : "This server uses the default welcoming channel!", message);
                        if (!row2 || !row2.bool) return client.editMsg(sMessage, `This server has welcoming messages disabled! Use \`${PREFIX}config welcome true\` to turn it back on.`, message);
                        if (row) {
                            if (row.channel === selectedChannel.id) return client.editMsg(sMessage, "The value you inputted is already active!", message);
                            sql.run(`UPDATE welcomeChannel SET channel = ${selectedChannel.id} WHERE guildId = ${message.guild.id}`);
                            client.editMsg(sMessage, `Successfully updated \`welcomechannel\` to ${selectedChannel}.`, message);
                        } else {
                            sql.run(`INSERT INTO welcomeChannel (guildId, channel) VALUES (?, ?)`, [message.guild.id, selectedChannel.id]);
                            client.editMsg(sMessage, `Successfully updated \`welcomechannel\` to ${selectedChannel}.`, message);
                        }
                    } else if (option === options[7]) { // prefix
                        // Checks for the custom permission
                        let bool2 = false;
                        let i = 0;
                        let prom = new Promise(resolve => {
                            message.member.roles.forEach(async role => {
                                let row2 = await sql.get('SELECT * FROM permissions WHERE roleID = ? AND pName = ? AND pCategory = ?', [role.id, "prefix", "misc"]);
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
                        let row = await sql.get(`SELECT * FROM prefix WHERE guildId = ${message.guild.id}`);
                        if (row && row.customPrefix === prefix) return client.editMsg(sMessage, "This server's prefix is already set to `" + prefix + "`!", message);
                        if (row) {
                            sql.run('UPDATE prefix SET customPrefix = ? WHERE guildId = ?', [prefix, message.guild.id]);
                            client.editMsg(sMessage, `Successfully updated \`prefix\` to \`${prefix}\`.`, message);
                        } else {
                            sql.run(`INSERT INTO prefix (guildId, customPrefix) VALUES (?, ?)`, [message.guild.id, prefix]);
                            client.editMsg(sMessage, `Successfully updated \`prefix\` to \`${prefix}\`.`, message);
                        }
                    } else if (option === options[8]) { // cooldownmsg
                        // Checks for the custom permission
                        let bool2 = false;
                        let i = 0;
                        let prom = new Promise(resolve => {
                            message.member.roles.forEach(async role => {
                                let row2 = await sql.get('SELECT * FROM permissions WHERE roleID = ? AND pName = ? AND pCategory = ?', [role.id, "cooldownmsg", "misc"]);
                                if ((row2 && row2.bool) || message.member === message.guild.owner)
                                    bool2 = true;
                                i++;
                                if (i === message.member.roles.size)
                                    setTimeout(resolve, 10);
                            });
                        });
                        await prom;
                        if (!bool2) return client.editMsg(sMessage, ":x:, Sorry, but you do not have the `misc.cooldownmsg` permission.", message);
                        let row = await sql.get(`SELECT * FROM cooldownmsg WHERE guildId = ${message.guild.id}`);
                        let bool;
                        if (!args[2]) bool = row ? (row.bool ? 0 : 1) : 1;
                        else {
                            if (args[2].toLowerCase() !== "false" && args[2].toLowerCase() !== "true") return client.editMsg(sMessage, "An invalid argument has been provided, please use `false` or `true`.", message);
                            bool = args[2] === "false" ? 0 : 1;
                        }
                        if (!row) {
                            if (bool === 0) return client.editMsg(sMessage, "The value you inputted is already active!", message);
                            sql.run(`INSERT INTO cooldownmsg (guildId, bool) VALUES (?, ?)`, [message.guild.id, bool]);
                            client.editMsg(sMessage, `Successfully updated \`cooldownmsg\` to \`${bool ? "true" : "false"}\`.`, message);
                        } else {
                            if (row.bool === bool) return client.editMsg(sMessage, "The value you inputted is already active!", message);
                            sql.run(`UPDATE cooldownmsg SET bool = ${bool} WHERE guildId = ${message.guild.id}`);
                            client.editMsg(sMessage, `Successfully updated \`cooldownmsg\` to \`${bool ? "true" : "false"}\`.`, message);
                        }
                    } else if (option === options[9]) { // blacklistmsg
                        // Checks for the custom permission
                        let bool2 = false;
                        let i = 0;
                        let prom = new Promise(resolve => {
                            message.member.roles.forEach(async role => {
                                let row2 = await sql.get('SELECT * FROM permissions WHERE roleID = ? AND pName = ? AND pCategory = ?', [role.id, "blacklist", "misc"]);
                                if ((row2 && row2.bool) || message.member === message.guild.owner)
                                    bool2 = true;
                                i++;
                                if (i === message.member.roles.size)
                                    setTimeout(resolve, 10);
                            });
                        });
                        await prom;
                        if (!bool2) return client.editMsg(sMessage, ":x:, Sorry, but you do not have the `misc.blacklist` permission.", message);
                        let row = await sql.get(`SELECT * FROM blacklistmsg WHERE guildId = ${message.guild.id}`);
                        let bool;
                        if (!args[2]) bool = row ? (row.bool ? 0 : 1) : 0;
                        else {
                            if (args[2].toLowerCase() !== "false" && args[2].toLowerCase() !== "true") return client.editMsg(sMessage, "An invalid argument has been provided, please use `false` or `true`.", message);
                            bool = args[2] === "false" ? 0 : 1;
                        }
                        if (!row) {
                            if (bool === 1) return client.editMsg(sMessage, "The value you inputted is already active!", message);
                            sql.run(`INSERT INTO blacklistmsg (guildId, bool) VALUES (?, ?)`, [message.guild.id, bool]);
                            client.editMsg(sMessage, `Successfully updated \`blacklistmsg\` to \`${bool ? "true" : "false"}\`.`, message);
                        } else {
                            if (row.bool === bool) return client.editMsg(sMessage, "The value you inputted is already active!", message);
                            sql.run(`UPDATE blacklistmsg SET bool = ${bool} WHERE guildId = ${message.guild.id}`);
                            client.editMsg(sMessage, `Successfully updated \`blacklistmsg\` to \`${bool ? "true" : "false"}\`.`, message);
                        }
                    } else if (option === options[10]) { // logchannel
                        // Checks for the custom permission
                        let bool2 = false;
                        let i = 0;
                        let prom = new Promise(resolve => {
                            message.member.roles.forEach(async role => {
                                let row3 = await sql.get('SELECT * FROM permissions WHERE roleID = ? AND pName = ? AND pCategory = ?', [role.id, "log", "mod"]);
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
                        let row = await sql.get(`SELECT * FROM logChannel WHERE guildId = ${message.guild.id}`);
                        let row2 = await sql.get(`SELECT * FROM actionlog WHERE guildId = ${message.guild.id}`);
                        if (!selectedChannel) return client.editMsg(sMessage, row ? `${message.guild.channels.get(row.channelId) ? message.guild.channels.get(row.channelId) : "`None`"} is the current log channel for this server!` : "This server uses the default log channel!", message);
                        if (!row2 || !row2.bool) return client.editMsg(sMessage, `This server has logs disabled! Use \`${PREFIX}config togglelog true\` to turn it back on.`, message);
                        if (row) {
                            if (row.channelId === selectedChannel.id) return client.editMsg(sMessage, "The value you inputted is already active!", message);
                            sql.run(`UPDATE logChannel SET channelId = ${selectedChannel.id} WHERE guildId = ${message.guild.id}`);
                            client.editMsg(sMessage, `Successfully updated \`logchannel\` to ${selectedChannel}.`, message);
                        } else {
                            sql.run(`INSERT INTO logChannel (guildId, channelId) VALUES (?, ?)`, [message.guild.id, selectedChannel.id]);
                            client.editMsg(sMessage, `Successfully updated \`logchannel\` to ${selectedChannel}.`, message);
                        }
                    } else if (option === options[11]) { // welcomepic
                        // Checks for the custom permission
                        let bool2 = false;
                        let i = 0;
                        let prom = new Promise(resolve => {
                            message.member.roles.forEach(async role => {
                                let row2 = await sql.get('SELECT * FROM permissions WHERE roleID = ? AND pName = ? AND pCategory = ?', [role.id, "welcome", "misc"]);
                                if ((row2 && row2.bool) || message.member === message.guild.owner)
                                    bool2 = true;
                                i++;
                                if (i === message.member.roles.size)
                                    setTimeout(resolve, 10);
                            });
                        });
                        await prom;
                        if (!bool2) return client.editMsg(sMessage, ":x:, Sorry, but you do not have the `misc.welcome` permission.", message);
                        let row = await sql.get(`SELECT * FROM picwelcome WHERE guildId = ${message.guild.id}`);
                        let bool;
                        if (!args[2]) bool = row ? (row.bool ? 0 : 1) : 0;
                        else {
                            if (args[2].toLowerCase() !== "false" && args[2].toLowerCase() !== "true") return client.editMsg(sMessage, "An invalid argument has been provided, please use `false` or `true`.", message);
                            bool = args[2] === "false" ? 0 : 1;
                        }
                        if (!row) {
                            if (bool === 1) return client.editMsg(sMessage, "The value you inputted is already active!", message);
                            sql.run(`INSERT INTO picwelcome (guildId, bool) VALUES (?, ?)`, [message.guild.id, bool]);
                            client.editMsg(sMessage, `Successfully updated \`welcomepic\` to \`${bool ? "true" : "false"}\`.`, message);
                        } else {
                            if (row.bool === bool) return client.editMsg(sMessage, "The value you inputted is already active!", message);
                            sql.run(`UPDATE picwelcome SET bool = ${bool} WHERE guildId = ${message.guild.id}`);
                            client.editMsg(sMessage, `Successfully updated \`welcomepic\` to \`${bool ? "true" : "false"}\`.`, message);
                        }
                    } else if (option === options[12]) { // togglestar
                        // Checks for the custom permission
                        let bool2 = false;
                        let i = 0;
                        let prom = new Promise(resolve => {
                            message.member.roles.forEach(async role => {
                                let row2 = await sql.get('SELECT * FROM permissions WHERE roleID = ? AND pName = ? AND pCategory = ?', [role.id, "star", "misc"]);
                                if ((row2 && row2.bool) || message.member === message.guild.owner)
                                    bool2 = true;
                                i++;
                                if (i === message.member.roles.size)
                                    setTimeout(resolve, 10);
                            });
                        });
                        await prom;
                        if (!bool2) return client.editMsg(sMessage, ":x:, Sorry, but you do not have the `misc.star` permission.", message);
                        let row = await sql.get(`SELECT * FROM togglestar WHERE guildId = ${message.guild.id}`);
                        let bool;
                        if (!args[2]) bool = row ? (row.bool ? 0 : 1) : 1;
                        else {
                            if (args[2].toLowerCase() !== "false" && args[2].toLowerCase() !== "true") return client.editMsg(sMessage, "An invalid argument has been provided, please use `false` or `true`.", message);
                            bool = args[2] === "false" ? 0 : 1;
                        }
                        if (!row) {
                            if (bool === 0) return client.editMsg(sMessage, "The value you inputted is already active!", message);
                            sql.run(`INSERT INTO togglestar (guildId, bool) VALUES (?, ?)`, [message.guild.id, bool]);
                            client.editMsg(sMessage, `Successfully updated \`togglestar\` to \`${bool ? "true" : "false"}\`.`, message);
                        } else {
                            if (row.bool === bool) return client.editMsg(sMessage, "The value you inputted is already active!", message);
                            sql.run(`UPDATE togglestar SET bool = ${bool} WHERE guildId = ${message.guild.id}`);
                            client.editMsg(sMessage, `Successfully updated \`togglestar\` to \`${bool ? "true" : "false"}\`.`, message);
                        }
                    } else if (option === options[13]) { // starchannel
                        // Checks for the custom permission
                        let bool2 = false;
                        let i = 0;
                        let prom = new Promise(resolve => {
                            message.member.roles.forEach(async role => {
                                let row3 = await sql.get('SELECT * FROM permissions WHERE roleID = ? AND pName = ? AND pCategory = ?', [role.id, "star", "misc"]);
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
                        let row = await sql.get(`SELECT * FROM starchannel WHERE guildId = ${message.guild.id}`);
                        let row2 = await sql.get(`SELECT * FROM togglestar WHERE guildId = ${message.guild.id}`);
                        if (!selectedChannel) return client.editMsg(sMessage, row ? `${message.guild.channels.get(row.channelId) ? message.guild.channels.get(row.channelId) : "`None`"} is the current starboard channel for this server!` : "This server uses the default starboard channel!", message);
                        if (row2 && !row2.bool) return client.editMsg(sMessage, `This server has starboard disabled! Use \`${PREFIX}config togglestar true\` to turn it back on.`, message);
                        if (row) {
                            if (row.channelId === selectedChannel.id) return client.editMsg(sMessage, "The value you inputted is already active!", message);
                            sql.run(`UPDATE starchannel SET channel = ${selectedChannel.id} WHERE guildId = ${message.guild.id}`);
                            client.editMsg(sMessage, `Successfully updated \`starchannel\` to ${selectedChannel}.`, message);
                        } else {
                            sql.run(`INSERT INTO starchannel (guildId, channelId) VALUES (?, ?)`, [message.guild.id, selectedChannel.id]);
                            client.editMsg(sMessage, `Successfully updated \`starchannel\` to ${selectedChannel}.`, message);
                        }
                    } else if (option === options[14]) { // updatechannel
                        // Checks for the custom permission
                        let bool2 = false;
                        let i = 0;
                        let prom = new Promise(resolve => {
                            message.member.roles.forEach(async role => {
                                let row3 = await sql.get('SELECT * FROM permissions WHERE roleID = ? AND pName = ? AND pCategory = ?', [role.id, "update", "misc"]);
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
                        let row = await sql.get(`SELECT * FROM updatechannel WHERE guildID = ?`, [message.guild.id]);
                        if (!selectedChannel) return client.editMsg(sMessage, row ? `${message.guild.channels.get(row.channelID) ? message.guild.channels.get(row.channelID) : "`None`"} is the current update channel for this server!` : "This server does not use an update channel!", message);
                        if (row) {
                            if (row.channelID === selectedChannel.id) return client.editMsg(sMessage, "The value you inputted is already active!", message);
                            sql.run('UPDATE updatechannel SET channelID = ? WHERE guildID = ?', [selectedChannel.id, message.guild.id]);
                            client.editMsg(sMessage, `Successfully updated \`updatechannel\` to ${selectedChannel}.`, message);
                        } else {
                            sql.run('INSERT INTO updatechannel (guildId, channelId) VALUES (?, ?)', [message.guild.id, selectedChannel.id]);
                            client.editMsg(sMessage, `Successfully updated \`updatechannel\` to ${selectedChannel}.`, message);
                        }
                    } else if (option === options[15]) { // deleteinvite
                        // Checks for the custom permission
                        let bool2 = false;
                        let i = 0;
                        let prom = new Promise(resolve => {
                            message.member.roles.forEach(async role => {
                                let row2 = await sql.get('SELECT * FROM permissions WHERE roleID = ? AND pName = ? AND pCategory = ?', [role.id, "invite", "misc"]);
                                if ((row2 && row2.bool) || message.member === message.guild.owner)
                                    bool2 = true;
                                i++;
                                if (i === message.member.roles.size)
                                    setTimeout(resolve, 10);
                            });
                        });
                        await prom;
                        if (!bool2) return client.editMsg(sMessage, ":x:, Sorry, but you do not have the `misc.invite` permission.", message);
                        let row = await sql.get('SELECT * FROM deleteinvite WHERE guildId = ?', [message.guild.id]);
                        let bool;
                        if (!args[2]) bool = row ? (row.bool ? 0 : 1) : 1;
                        else {
                            if (args[2].toLowerCase() !== "false" && args[2].toLowerCase() !== "true") return client.editMsg(sMessage, "An invalid argument has been provided, please use `false` or `true`.", message);
                            bool = args[2] === "false" ? 0 : 1;
                        }
                        if (!row) {
                            if (bool === 0) return client.editMsg(sMessage, "The value you inputted is already active!", message);
                            sql.run(`INSERT INTO deleteinvite (guildId, bool) VALUES (?, ?)`, [message.guild.id, bool]);
                            client.editMsg(sMessage, `Successfully updated \`deleteinvite\` to \`${bool ? "true" : "false"}\`.`, message);
                        } else {
                            if (row.bool === bool) return client.editMsg(sMessage, "The value you inputted is already active!", message);
                            sql.run(`UPDATE deleteinvite SET bool = ${bool} WHERE guildId = ${message.guild.id}`);
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