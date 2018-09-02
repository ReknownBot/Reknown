module.exports = {
    help: "Searches a user's messages! `Usage: ?search <Mention or ID> <Amount>",
    func: async (client, message, args, unknownCommand, mess, sql, Discord, fs, PREFIX, bool) => {
            try {
                async function searchcmd(sMessage) {
                    let selectedMember = message.guild.members.get(args[1] ? args[1].replace(/[<>@&!]/g, "") : null);
                    if (!selectedMember) return client.editMsg(sMessage, "That member does not exist! Please provide a mention or an ID.", message);

                    let amount = parseInt(args[2]);
                    if (!amount) return client.editMsg(sMessage, "You have to provide a valid amount for me to search.", message);
                    if (amount > 500) return client.editMsg(sMessage, "You cannot search more than 500 messages!", message);
                    if (amount < 1) return client.editMsg(sMessage, "The number has to be equal or larger than one!", message);

                    let max = Math.ceil(amount / 100);
                    let x = [];
                    let num = 1;
                    let lastID;
                    for (let i = 0; i < max; i++) {
                        if (amount > 100) {
                            let msgs = await message.channel.messages.fetch({
                                limit: 100,
                                before: lastID ? lastID : null
                            });
                            let messages = msgs.filter(m => m.author.id === selectedMember.id).sort((a, b) => {
                                // Message Created after
                                if (a.createdTimestamp > b.createdTimestamp) {
                                    return 1;
                                } else if (a.createdTimestamp < b.createdTimestamp) {
                                    return -1;
                                } else { // Very slim chance of happening
                                    return 0;
                                }
                            });
                            lastID = msgs.first() ? msgs.first().id : null;
                            await messages.forEach(m => {
                                if (m.author.id !== selectedMember.id) return;
                                x.push(`\`${num}. ${m.content}\``);
                                num++;
                            });
                            amount -= 100;
                        } else if (amount === 100) {
                            let msgs = await message.channel.messages.fetch({
                                limit: amount,
                                before: lastID ? lastID : null
                            });
                            let messages = msgs.filter(m => m.author.id === selectedMember.id).sort((a, b) => {
                                // Message Created after
                                if (a.createdTimestamp > b.createdTimestamp) {
                                    return 1;
                                } else if (a.createdTimestamp < b.createdTimestamp) {
                                    return -1;
                                } else { // Very slim chance of happening
                                    return 0;
                                }
                            });
                            lastID = msgs.first() ? msgs.first().id : null;
                            await messages.forEach(m => {
                                if (m.author.id !== selectedMember.id) return;
                                x.push(`\`${num}. ${m.content}\``);
                                num++;
                            });
                            amount -= 100;
                        } else {
                            let msgs = await message.channel.messages.fetch({
                                limit: amount,
                                before: lastID ? lastID : null
                            });
                            let messages = msgs.filter(m => m.author.id === selectedMember.id).sort((a, b) => {
                                // Message Created after
                                if (a.createdTimestamp > b.createdTimestamp) {
                                    return 1;
                                } else if (a.createdTimestamp < b.createdTimestamp) {
                                    return -1;
                                } else { // Very slim chance of happening
                                    return 0;
                                }
                            });
                            await messages.forEach(m => {
                                if (m.author.id !== selectedMember.id) return;
                                x.push(`\`${num}. ${m.content}\``);
                                num++;
                            });
                        }
                    }
                    if (x.length === 0) return client.editMsg(sMessage, "I did not find anything!", message);
                    message.channel.send(x, {
                        split: true
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
                    searchcmd(msgToEdit);
                } else {
                    searchcmd(message);
                }
            } catch (e) {
                message.channel.send(`Something went wrong while executing the command: \`${PREFIX}search\`\n\n\`\`\`xl\n${e}\n\`\`\``);
                console.error(e);
            }
        },
        jyguyOnly: 0,
        category: "misc"
}