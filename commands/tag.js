module.exports = {
    help: "Adds / Removes a tag from your user / guild! `Tip: User tags override guild tags! Remember that.` (For Guild, tag.edit Required) `Usage: ?tag add <Tag Name> OR ?tag remove <Tag Name> OR ?tag guildadd <Tag Name> OR ?tag guildremove <Tag Name>`",
    func: async (client, message, args, unknownCommand, mess, sql, Discord, fs, PREFIX, bool) => {
            try {
                async function tagcmd(sMessage) {
                    if (!args[1]) return client.editMsg(sMessage, "You have to put a parameter! `Usage: ?tag add <Tag Name> OR ?tag remove <Tag Name> OR ?tag guildadd <Tag Name> OR ?tag guildremove <Tag Name>`", message);
                    let choices = [
                        "add",
                        "remove",
                        "guildadd",
                        "guildremove",
                        "show"
                    ];
                    let choice = args[1].toLowerCase();
                    if (!choices.includes(choice)) return client.editMsg(sMessage, "That is not a valid parameter! `Usage: ?tag add <Tag Name> OR ?tag remove <Tag Name> OR ?tag guildadd <Tag Name> OR ?tag guildremove <Tag Name> OR ?tag show <Tag Name>`", message);
                    if (choices[0] === choice) { // Add
                        if (!args[2]) return client.editMsg(sMessage, "You have to put a tag name!", message);
                        let tagName = args.slice(2).join(' ');
                        if (tagName.length > 49) return client.editMsg(sMessage, "Please keep the tag name under 50 characters.", message);
                        let row = await sql.get(`SELECT * FROM usertag WHERE tagname = ?`, [tagName]);
                        if (row) return client.editMsg(sMessage, `You already have a tag named \`${tagName}\`!`, message);
                        message.channel.send("What should the tag's content be? You can also say `cancel` to abort the action.");
                        const filter = (m) => m.author.id === message.author.id && m.channel.id === message.channel.id;
                        const collector = message.channel.createMessageCollector(filter, {
                            time: 10000
                        });
                        collector.on("collect", collected => {
                            collector.stop();
                            if (!collected.content) return client.editMsg(sMessage, ":x:, Please send actual characters.", message);
                            if (collected.content.toLowerCase() === "cancel") return client.editMsg(sMessage, ":ok_hand:, Cancelled Action.", message);
                            sql.run("INSERT INTO usertag (userID, tagcontent, tagname) VALUES (?, ?, ?)", [message.author.id, collected.content, tagName]);
                            client.editMsg(sMessage, "Successfully added a tag.", message);
                        });

                        collector.on("end", collected => {
                            if (collected.size === 0) client.editMsg(sMessage, "No response collected, aborting action.", message);
                        });
                    } else if (choices[1] === choice) { // Remove
                        if (!args[2]) return client.editMsg(sMessage, "You have to put a tag name for me to remove!", message);
                        let tagName = args.slice(2).join(' ');
                        if (tagName.length > 49) return client.editMsg(sMessage, "Tag names has to be less than 50 characters!", message);
                        let row = await sql.get(`SELECT * FROM usertag WHERE tagname = ?`, [tagName]);
                        if (!row) return client.editMsg(sMessage, "That tag does not exist!", message);
                        sql.run(`DELETE FROM usertag WHERE tagname = ?`, [tagName]);
                        client.editMsg(sMessage, "Successfully removed a tag.", message);
                    } else if (choices[2] === choice) { // Guildadd
                        // Checks for the custom permission
                        let bool2 = false;
                        let i = 0;
                        let prom = new Promise(resolve => {
                            message.member.roles.forEach(async role => {
                                let row = await sql.get('SELECT * FROM permissions WHERE roleID = ? AND pName = ? AND pCategory = ?', [role.id, "edit", "tag"]);
                                if ((row && row.bool) || message.member === message.guild.owner)
                                    bool2 = true;
                                i++;
                                if (i === message.member.roles.size)
                                    setTimeout(resolve, 10);
                            });
                        });
                        await prom;
                        if (!bool2) return client.editMsg(sMessage, ":x:, Sorry, but you do not have the `tag.edit` permission.", message);
                        if (!args[2]) return client.editMsg(sMessage, "You have to put a tag name!", message);
                        let tagName = args.slice(2).join(' ');
                        if (tagName.length > 49) return client.editMsg(sMessage, "Please keep the tag name under 50 characters.", message);
                        let row2 = await sql.get(`SELECT * FROM guildtag WHERE tagname = ?`, [tagName]);
                        if (row2) return client.editMsg(sMessage, `The guild already have a tag named \`${tagName}\`!`, message);
                        message.channel.send("What should the tag's content be? You can also say `cancel` to abort the action.");
                        const filter = (m) => m.author.id === message.author.id && m.channel.id === message.channel.id;
                        const collector = message.channel.createMessageCollector(filter, {
                            time: 10000
                        });
                        collector.on("collect", collected => {
                            collector.stop();
                            if (!collected.content) return client.editMsg(sMessage, ":x:, Please send actual characters.", message);
                            if (collected.content.toLowerCase() === "cancel") return client.editMsg(sMessage, ":ok_hand:, Cancelled Action.", message);
                            sql.run("INSERT INTO guildtag (guildID, tagcontent, tagname) VALUES (?, ?, ?)", [message.guild.id, collected.content, tagName]);
                            client.editMsg(sMessage, "Successfully added a tag.", message);
                        });

                        collector.on("end", collected => {
                            if (collected.size === 0) client.editMsg(sMessage, "No response collected, aborting action.", message);
                        });
                    } else if (choices[3] === choice) { // Guildremove
                        // Checks for the custom permission
                        let bool2 = false;
                        let i = 0;
                        let prom = new Promise(resolve => {
                            message.member.roles.forEach(async role => {
                                let row2 = await sql.get('SELECT * FROM permissions WHERE roleID = ? AND pName = ? AND pCategory = ?', [role.id, "edit", "tag"]);
                                if ((row2 && row2.bool) || message.member === message.guild.owner)
                                    bool2 = true;
                                i++;
                                if (i === message.member.roles.size)
                                    setTimeout(resolve, 10);
                            });
                        });
                        await prom;
                        if (!bool2) return client.editMsg(sMessage, ":x:, Sorry, but you do not have the `tag.edit` permission.", message);
                        if (!args[2]) return client.editMsg(sMessage, "You have to put a tag name for me to remove!", message);
                        let tagName = args.slice(2).join(' ');
                        if (tagName.length > 49) return client.editMsg(sMessage, "Tag names has to be less than 50 characters!", message);
                        let row = await sql.get(`SELECT * FROM guildtag WHERE tagname = ?`, [tagName]);
                        if (!row) return client.editMsg(sMessage, "That tag does not exist!", message);
                        sql.run(`DELETE FROM guildtag WHERE tagname = ?`, [tagName]);
                        client.editMsg(sMessage, "Successfully removed a guild tag.", message);
                    } else if (choices[4] === choice) { // Show
                        if (!args[2]) return client.editMsg(sMessage, "You have to put a tag name for me to display!", message);
                        let tagName = args.slice(2).join(' ');
                        let userTag = await sql.get("SELECT * FROM usertag WHERE tagname = ?", [tagName]);
                        if (!userTag) {
                            let guildTag = await sql.get("SELECT * FROM guildtag WHERE tagname = ?", [tagName]);
                            if (!guildTag) return client.editMsg(sMessage, "That tag does not exist!", message);
                            // Checks for the custom permission
                            let bool2 = false;
                            let i = 0;
                            let prom = new Promise(resolve => {
                                message.member.roles.forEach(async role => {
                                    let row2 = await sql.get('SELECT * FROM permissions WHERE roleID = ? AND pName = ? AND pCategory = ?', [role.id, "view", "tag"]);
                                    if ((row2 && row2.bool) || message.member === message.guild.owner)
                                        bool2 = true;
                                    i++;
                                    if (i === message.member.roles.size)
                                        setTimeout(resolve, 10);
                                });
                            });
                            await prom;
                            if (!bool2) return client.editMsg(sMessage, ":x:, Sorry, but you do not have the `tag.view` permission.", message);
                            client.editMsg(sMessage, guildTag.tagcontent, message);
                        } else {
                            client.editMsg(sMessage, userTag.tagcontent, message);
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
                    tagcmd(msgToEdit);
                } else {
                    tagcmd(message);
                }
            } catch (e) {
                message.channel.send(`Something went wrong while executing the command: \`${PREFIX}tag\`\n\n\`\`\`xl\n${e}\n\`\`\``);
                console.error(e);
            }
        },
        jyguyOnly: 0,
        category: "misc"
}