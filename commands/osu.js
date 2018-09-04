module.exports = {
    help: "Gets the osu! info about a user! Needs an API key or a link to the user. `Usage: ?osu <osu gamemode> <User ID or Username>`",
    func: async (client, message, args, unknownCommand, mess, sql, Discord, fs, PREFIX, bool) => {
        try {
            async function osucmd(sMessage) {
                let osuType = args[1];
                if (!osuType) return client.editMsg(sMessage, "You have to put in a type and a username or an ID!", message);
                if (osuType.toLowerCase() !== "standard" && osuType.toLowerCase() !== "taiko" && osuType.toLowerCase() !== "mania" && osuType.toLowerCase() !== "ctb") return client.editMsg(sMessage, "You have to put in a valid osu gamemode! (osu, mania, ctb, or taiko)", message);
                if (osuType === "standard") osuType = 0;
                else if (osuType === "taiko") osuType = 1;
                else if (osuType === 'ctb') osuType = 2;
                else if (osuType === 'mania') osuType = 3;
                else return client.editMsg(sMessage, "You have to put in a valid osu gamemode! (standard, taiko, mania, or catch)", message);
                let osuUser = args.slice(2).join(' ');
                if (!osuUser) return client.editMsg(sMessage, "You need to provide a username or an ID of an osu! player!", message);
                let osuApi = new client.osu.Api(client.osuKey);
                let user;
                try {
                    user = await osuApi.getUser({
                        u: osuUser.trim(),
                        m: osuType
                    });
                } catch (e) {
                    return client.editMsg(sMessage, "I could not find any user with that name / ID.", message);
                }
                if (osuType === 0) osuType = '';
                else if (osuType === 1) osuType = 'taiko';
                else if (osuType === 2) osuType = 'catch';
                else if (osuType === 3) osuType = 'mania';
                let embed = new Discord.MessageEmbed()
                    .setTitle(`${user.name}'s osu!${osuType} Info`)
                    .setColor(0x00FFFF)
                    .addField("PP", user.pp.raw, true)
                    .addField("PP Rank (Performance Points Global Rank)", user.pp.rank ? user.pp.rank : "Unknown", true)
                    .addField("Country PP Rank", user.pp.countryRank ? user.pp.countryRank : "Unknown", true)
                    .addField("Ranked Score", user.scores.ranked ? user.scores.ranked : "Unknown", true)
                    .addField("Total Score", user.scores.total ? user.scores.total : "Unknown", true)
                    .addField("Level", user.level ? Math.floor(user.level) : "Unknown or 0", true)
                    .addField("SS Passes", user.counts.SS ? user.counts.SS : "Unknown or 0", true)
                    .addField("S Passes", user.counts.S ? user.counts.S : "Unknown or 0", true)
                    .addField("A Passes", user.counts.A ? user.counts.S : "Unknown or 0", true)
                    .addField("Accuracy", user.accuracy ? user.accuracy : "Unknown or 0", true)
                    .addField("Plays", user.counts.plays ? user.counts.plays : "Unknown or 0", true)
                    .addField("Country", user.country ? user.country : "Unknown", true)
                    .addField("User ID", user.id ? user.id : "Unknown", true)
                    .setFooter("Powered by node-osu")
                    .setFooter(`Requested by: ${message.author.tag}`);
                client.editMsg(sMessage, embed, message);
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
                osucmd(msgToEdit);
            } else {
                osucmd(message);
            }
        } catch (e) {
            let rollbar = new client.Rollbar(client.rollbarKey);
            rollbar.error("Something went wrong in osu.js", e);
            console.error(e);
            message.channel.send(`Something went wrong while executing the command: \`${PREFIX}osu\`\n\n\`\`\`xl\n${e}\n\`\`\``);
        }
    },
    jyguyOnly: 0,
    category: "misc"
}