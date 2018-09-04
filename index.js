const Discord = require("discord.js");
const fs = require("fs");
const { Client } = require("pg");
require("dotenv").config();
const sql = new Client({
    user: process.env.SQL_USER,
    password: process.SQL_PASS,
    database: process.env.SQL_DB,
    port: process.env.SQL_PORT,
    host: process.env.SQL_HOST,
    ssl: true
});
const HypixelAPI = require("hypixel-api");
require("array-utility"); // More useful array methods
let emojis = [
    "1⃣", "2⃣", "3⃣", "4⃣", "5⃣", "⏹"
];
let client = { // Creates an object client
    bot: new Discord.Client({
        disableEveryone: true,
        disabledEvents: [
            "TYPING_START"
        ],
        presence: {
            activity: {
                name: `${client.bot.guilds.size} Servers`,
                type: "WATCHING"
            }
        }
    }), // Defines bot, the discord client inside the object client
    commands: {}, // Defines an empty object commands
    events: {},
    spigetGuildID: "422121219576430604",
    commandsList: fs.readdirSync('./commands'),
    eventList: fs.readdirSync('./events'),
    ytdl: require("ytdl-core"),
    getYouTubeID: require("get-youtube-id"),
    fetchVideoInfo: require("youtube-info"),
    Rollbar: require("rollbar"),
    osu: require("node-osu"),
    canvas: require("canvas"),
    fetch: require("node-fetch"),
    dateFormat: require("dateformat"),
    fuzz: require("fuzzball"),
    escape: require("sqlstring").escape,
    cooldown: new Set(),
    msgEdit: {},
    guilds: {},
    mBool: {},
    skip_song: async function (message) {
        this.guilds[message.guild.id].dispatcher.end();
    },
    playMusic: async function (id, message, connection) {
        if (!message.member.voice.channel) return;
        let guild = this.guilds[message.guild.id];

        stream = this.ytdl("https://www.youtube.com/watch?v=" + id, {
            filter: 'audioonly'
        });
        guild.skipReq = 0;
        guild.skippers = [];
        guild.isPlaying = true;

        guild.dispatcher = connection.play(stream);
        guild.dispatcher.setVolumeLogarithmic(guild.volume / 180);
        guild.dispatcher.on('finish', function () {
            guild.skipReq = 0;
            guild.skippers = [];
            guild.queue.shift();
            guild.queueNames.shift();
            if (guild.queue.length === 0) {
                guild.queue = [];
                guild.queueNames = [];
                guild.isPlaying = false;
            } else {
                setTimeout(() => {
                    client.playMusic(guild.queue[0], message, connection);
                }, 500);
            }
        });
    },
    add_to_queue: async function (strID, message) {
        if (!message.member.voice.channel) return;
        if (this.isYoutube(strID)) {
            this.guilds[message.guild.id].queue.push(this.getYouTubeID(strID));
        } else {
            this.guilds[message.guild.id].queue.push(strID);
        }
    },
    isYoutube: function (str) {
        return str.toLowerCase().indexOf("youtube.com") > -1;
    },
    isAFK: {},
    editMsg: async function (msg, content, msg3) {
        if (!msg.id)
            msg = null;
        if (!msg || msg.author.id !== this.bot.user.id) {
            let msg2 = await msg3.channel.send(content);
            this.msgEdit[msg3.id] = msg2.id;
            return msg2;
        } else {
            let msg2 = await msg.edit(content.files ? '' : content, content.files ? {
                embed: content
            } : {
                    embed: null
                });
            this.msgEdit[msg3.id] = msg2.id;
            return msg2;
        }
    },
    randFromArr: (array) => array[Math.floor(Math.random() * array.length)],
    capitalizeFirstLetter: (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    },
    permissions: {
        mod: [
            "ban",
            "softban",
            "unban",
            "kick",
            "mute",
            "unmute",
            "warn",
            "unwarn",
            'nick',
            'log',
            "purge",
            "blacklist",
            "unblacklist",
            "ccreate",
            "cdelete"
        ],
        tag: [
            "edit",
            "view"
        ],
        music: [
            'fskip',
            'clear',
            'resume',
            'pause'
        ],
        level: [
            'role',
            'options',
            "set"
        ],
        slowmode: [
            "set",
            "bypass"
        ],
        misc: [
            "setperm",
            "rules",
            "star",
            "prefix",
            "togglemsg",
            "welcome",
            "update",
            "autorole",
            "invite"
        ]
    }
}

const Youtube = require("simple-youtube-api");
client.youtube = new Youtube(process.env.YT_API_KEY);
client.osuKey = process.env.OSU_KEY;
client.hypixel = new HypixelAPI(process.env.HYPIXEL_KEY);
client.rollbarKey = process.env.ROLLBAR_ACCESS_TOKEN;

client.load = async (command, message, sMessage) => {
    if (command) {
        if (client.commandsList.indexOf(`${command}.js`) >= 0) {
            delete require.cache[require.resolve(`./commands/${command}`)];
            client.commands[command] = require(`./commands/${command}`);
            client.editMsg(sMessage, `Reloaded ${command}!`, message);
        } else {
            client.editMsg(sMessage, "Command not found!", message);
        }
    } else { // If no input
        client.commands = {};
        for (i = 0; i < client.commandsList.length; i++) {
            let item = client.commandsList[i];
            if (item.match(/\.js$/)) {
                delete require.cache[require.resolve(`./commands/${item}`)];
                client.commands[item.slice(0, -3)] = require(`./commands/${item}`);
            }
        }
        client.editMsg(sMessage, "Reloaded all commands!", message);
    }
}

client.getID = async function (str, cb, message) {
    if (this.isYoutube(str)) {
        if (str.match(/^https?:\/\/(www.youtube.com|youtube.com)\/playlist(.*)$/)) {
            const playlist = await this.youtube.getPlaylist(str);
            const videos = await playlist.getVideos();
            let i = 0;
            let done2 = false;
            for (const video of Object.values(videos)) {
                const video2 = await this.youtube.getVideoByID(video.id);
                if (!this.guilds[message.guild.id].thingy)
                    done2 = false,
                        this.guilds[message.guild.id].thingy = true;
                else
                    done2 = true;
                if (i === 0) {
                    await cb(video2.id, true, playlist.title, true, done2);
                } else {
                    await cb(video2.id, true, playlist.title, false, done2);
                }
                i++;
            }
        } else {
            cb(this.getYouTubeID(str));
        }
    } else {
        this.search_video(str, function (id) {
            cb(id);
        }, message);
    }
}

client.search_video = async function (query, callback, message) {
    let results = await client.youtube.searchVideos(query, 5);
    let arr = [];
    let IDarr = [];
    results.forEach((r, index) => {
        arr.push(`**${index + 1}: ${r.title}**`);
        IDarr.push(r.id);
    });

    if (arr.length === 0) {
        callback("c5daGZ96QGU");
        return message.channel.send("I did not find any results, so I'll play **Undertale OST: 100 - Megalovania**");
    }
    this.mBool[message.guild.id] = true;

    let msg = await message.channel.send(`Here are the results:\n\n${arr.join('\n')}\n\nPlease choose by reacting to one of these.`);
    await msg.react(emojis[0]);
    await msg.react(emojis[1]);
    await msg.react(emojis[2]);
    await msg.react(emojis[3]);
    await msg.react(emojis[4]);
    await msg.react(emojis[5]);

    const filter = (reaction, user) => user.id === message.author.id && emojis.includes(reaction.emoji.name);
    const collector = msg.createReactionCollector(filter, {
        time: 30000
    });

    collector.on("collect", reaction => {
        collector.stop();
        this.mBool[message.guild.id] = false;
        msg ? msg.delete() : undefined;
        let reactionNumber;
        if (reaction.emoji.name === emojis[0])
            reactionNumber = 0;
        else if (reaction.emoji.name === emojis[1])
            reactionNumber = 1;
        else if (reaction.emoji.name === emojis[2])
            reactionNumber = 2;
        else if (reaction.emoji.name === emojis[3])
            reactionNumber = 3;
        else if (reaction.emoji.name === emojis[4])
            reactionNumber = 4;
        else if (reaction.emoji.name === emojis[5])
            reactionNumber = 5;
        if (reactionNumber === 5) {
            message.channel.send("Ok, cancelling search.");
        } else {
            if (arr.length === 5) {
                callback(IDarr[reactionNumber]);
            } else if (arr.length < 5 && reactionNumber < 4) {
                message.channel.send("That is not a valid result!");
            }
        }
    });

    collector.on("end", collected => {
        if (collected.size < 1) {
            this.mBool[message.guild.id] = false;
            message.channel.send("No reaction collected, cancelling command.");
            msg ? msg.delete() : undefined;
        }
    });
}

Object.filter = (obj, predicate) =>
    Object.keys(obj)
        .filter(key => predicate(obj[key]))
        .reduce((res, key) => (res[key] = obj[key], res), {});

let rollbar = new client.Rollbar(client.rollbarKey);

for (i = 0; i < client.commandsList.length; i++) { // Creates a loop
    let item = client.commandsList[i]; // Defines each of the file as item
    if (item.match(/\.js$/)) { // only take js files
        delete require.cache[require.resolve(`./commands/${item}`)]; // delete the cache of the require, useful in case you wanna reload the command again
        client.commands[item.slice(0, -3)] = require(`./commands/${item}`); // and put the require inside the client.commands object
    }
}

for (i = 0; i < client.eventList.length; i++) { // Creates a loop
    let item = client.eventList[i]; // Defines each of the file as item
    if (item.match(/\.js$/)) { // only take js files
        delete require.cache[require.resolve(`./events/${item}`)]; // delete the cache of the require, useful in case you wanna reload the command again
        client.events[item.slice(0, -3)] = require(`./events/${item}`); // and put the require inside the client.commands object
    }
}

client.bot.on("ready", async () => { // Starts the event "ready", this is executed when the bot is ready
    console.log("I am ready!"); // sends a message to the log

    await sql.connect();

    sql.query('DELETE FROM mute');
});

process.on('unhandledRejection', error => {
    //rollbar.error("Unhandled Rejection", error);
    console.log(error);
});
/*.on('uncaughtException', exception => {
        rollbar.error("Uncaught Exception", exception.stack);
    }).on('warn', warn => {
        rollbar.warning("Warning:", warn.stack);
    });*/

client.bot.on('error', error => {
    if (!error.message.includes("ECONNRESET")) {
        //rollbar.error('Error:', error);
        console.error(error);
    }
});


let channels = {};

client.bot.on("message", async message => { // Starts the event "message", this is executed whenever a message is sent where the bot is included.
    // If it's a DM, return
    if (message.channel.type !== "text") return;
    // The author is a bot? Return.
    if (message.author.bot) return;

    // Checks for perms
    if (!message.guild.me.permissionsIn(message.channel).has("SEND_MESSAGES") || !message.guild.me.permissionsIn(message.channel).has("VIEW_CHANNEL")) {
        if (!message.guild.me.hasPermission("ADMINISTRATOR")) return;
    }

    client.msgEdit[message.id] = null;

    let mess = message.content.toLowerCase().trim(); // Defines mess, which is the lowercase version of the original msg

    if (!client.guilds[message.guild.id]) {
        client.guilds[message.guild.id] = {
            queue: [],
            queueNames: [],
            isPlaying: false,
            dispatcher: null,
            voiceChannel: null,
            skipReq: 0,
            skippers: [],
            volume: 50
        };
    }

    if (!message.member)
        message.member = await message.guild.members.fetch({
            user: message.author,
            cache: true
        });

    if (message.guild.me.permissionsIn(message.channel).has("MANAGE_MESSAGES") || message.guild.me.hasPermission("ADMINISTRATOR")) {
        // Start of slowmode
        // Checks for perms
        let bool2 = false;
        let i = 0;
        let prom = new Promise(resolve => {
            message.member.roles.forEach(async role => {
                let row3 = (await sql.query(`SELECT * FROM permissions WHERE roleID = '${role.id}' AND pName = 'bypass' AND pCategory = 'slowmode'`)).rows[0];
                if ((row3 && row3.bool) || message.member === message.guild.owner)
                    bool2 = true;
                i++;
                if (i === message.member.roles.size)
                    setTimeout(resolve, 10);
            });
        });
        await prom;
        if (!bool2) {
            if (!channels[message.channel.id])
                channels[message.channel.id] = new Set();
            let row = (await sql.query(`SELECT * FROM slowmode WHERE guildId = '${message.guild.id}' AND channelId = '${message.channel.id}'`)).rows[0];
            if (row) {
                if (channels[message.channel.id].has(message.author.id)) return message.delete().catch(O_o => { });
                channels[message.channel.id].add(message.author.id);
                setTimeout(() => channels[message.channel.id].delete(message.author.id), row.cooldown * 1000);
            }
        }
        // End of slowmode
    }

    // Start of deleteinvite
    let bool2 = false;
    let i = 0;
    let prom = new Promise(resolve => {
        message.member.roles.forEach(async role => {
            let row4 = (await sql.query(`SELECT * FROM permissions WHERE roleID = '${role.id}' AND pName = 'invite' AND pCategory = 'misc'`)).rows[0];
            if ((row4 && row4.bool) || message.member === message.guild.owner)
                bool2 = true;
            i++;
            if (i === message.member.roles.size) {
                setTimeout(resolve, 10);
            }
        });
    });
    await prom;
    if (!bool2) {
        let row5 = (await sql.query(`SELECT * FROM deleteinvite WHERE guildId = '${message.guild.id}'`)).rows[0];
        if (row5 && row5.bool && message.guild.me.permissionsIn(message.channel).has("MANAGE_MESSAGES") && message.deletable && /(?:https?:\/\/)?discord(?:app.com\/invite|.gg)\/[\w\d]+/gi.test(message.content)) {
            message.delete();
            let m = await message.reply(" No invite links.");
            m.delete({
                timeout: 5000
            });
        }
    }
    // End of deleteinvite

    try {
        // Start of levelling system
        async function thingy() {
            let row = (await sql.query(`SELECT * FROM scores WHERE userID = '${message.author.id}' AND guildID = '${message.guild.id}'`)).rows[0];
            if (!row) { // If the row is not found
                sql.query(`INSERT INTO scores (userID, points, level, guildID) VALUES ('${message.author.id}', 1, 0, '${message.guild.id}')`);
            } else { // If the row is found
                let curLevel = Math.floor(0.2 * Math.sqrt(row.points + message.content.length));
                if (curLevel > row.level) {
                    row.level = curLevel;
                    sql.query(`UPDATE scores SET points = ${row.points + message.content.length}, level = ${curLevel} WHERE userID = '${message.author.id}' AND guildID = '${message.guild.id}'`);
                    let msg = await message.channel.send(`${message.author}, You're now level ${curLevel}! Nice :)`);
                    msg.delete({
                        timeout: 5000
                    }).catch((e) => {
                        if (!e.toString().includes('Unknown Message')) {
                            rollbar.error("Something went wrong in index.js levelling system", e);
                            console.error(e);
                        }
                    });
                    let { rows } = await sql.query(`SELECT * FROM levelrole WHERE guildID = '${message.guild.id}' AND level <= ${curLevel}`);
                    if (rows[0]) {
                        let roleArr = [];
                        rows.forEach(r => {
                            if (!message.guild.roles.get(r.roleID))
                                return sql.query(`DELETE FROM levelrole WHERE guildID = '${message.guild.id}' AND roleID = '${r.roleID}'`);
                            roleArr.push(r.roleID);
                        });
                        if (roleArr.length === 1) {
                            let sRole = message.guild.roles.get(roleArr[0]);
                            if ((message.guild.me.hasPermission("MANAGE_ROLES") || message.guild.me.hasPermission("ADMINISTRATOR")) && sRole.position < message.guild.me.roles.highest.position && !message.member.roles.has(sRole.id))
                                message.member.roles.add(sRole, 'Level Role');
                        } else if (roleArr.length > 1) {
                            for (let i = 0; i < roleArr.length; i++) {
                                let sRole = message.guild.roles.get(roleArr[i]);
                                if ((message.guild.me.hasPermission("MANAGE_ROLES") || message.guild.me.hasPermission("ADMINISTRATOR")) && sRole.position < message.guild.me.roles.highest.position && !message.member.roles.has(sRole.id))
                                    message.member.roles.add(sRole, "Level Role")
                            }
                        }
                    }
                }
                sql.query(`UPDATE scores SET points = ${row.points + message.content.length} WHERE userID = '${message.author.id}' AND guildID = '${message.guild.id}'`);
            }
        }

        let row = (await sql.query(`SELECT * FROM toggleLevel WHERE guildId = '${message.guild.id}'`)).rows[0];
        if (row && row.bool) {
            thingy();
        }
        // End of levelling system
    } catch (e) {
        rollbar.error("Something went wrong in index.js levelling system", e);
        console.error(e);
    }

    async function commandThingy(customPrefix) {
        //if (message.mentions.users.has(client.bot.user.id)) message.channel.send("In case you forgot the prefix, it is `" + customPrefix + "`!");
        if (message.content.startsWith(customPrefix) && message.content !== customPrefix) { // If the message starts with the prefix
            async function commandThingy2() {
                let msg;
                let args = message.content.slice(customPrefix.length).split(' '); // Defines args, which is put in an array with the prefix gone
                // Removes all double spaces
                for (let i = args.length - 1; i--;)
                    if (args[i] == '')
                        args.splice(i, 1);
                let r = (await sql.query(`SELECT * FROM prefix WHERE guildId = '${message.guild.id}'`)).rows[0];
                async function commandRun() {
                    let unknownCommand = `Invalid command. Use ${customPrefix}help to see the commands!`; // Defines unknownCommand so jyguy doesn't need to type it all the time
                    if (args[0].toLowerCase() in client.commands) { // if there is the command in the command list
                        client.commands[args[0].toLowerCase()].func(client, message, args, unknownCommand, mess, sql, Discord, fs, customPrefix, false); // executes the function of the command (code in separate files in folder commands)
                    } else {
                        let row = (await sql.query(`SELECT * FROM cmdnotfound WHERE guildId = '${message.guild.id}'`)).rows[0];
                        if (!row || !row.bool) return;
                        let arr = [];
                        client.commandsList.forEach(command => {
                            let rawcommand = command.slice(0, command.length - 3);
                            let item = client.commands[rawcommand];
                            // If the message author ID is Jyguy, add it to the list regardless of guilds
                            if (message.author.id === '288831103895076867') {
                                arr.push(`${rawcommand} ${client.fuzz.ratio(rawcommand, args[0])}`);
                                // From now on the member will be 100% not jyguy
                                // If default
                            } else if (!item.jyguyOnly)
                                arr.push(`${rawcommand} ${client.fuzz.ratio(rawcommand, args[0])}`);
                        });
                        let arr2 = arr.sort((a, b) => {
                            return b.split(' ')[1] - a.split(' ')[1];
                        });
                        msg = await message.channel.send(`Could not find the command. Did you mean \`${arr2[0].split(' ')[0]}, ${arr2[1].split(' ')[0]}, or ${arr2[2].split(' ')[0]}\`?`);
                        client.msgEdit[message.id] = msg.id;
                    }
                }
                if (!r) {
                    commandRun();
                } else {
                    customPrefix = r.customPrefix;
                    commandRun();
                }
            }
            let row = (await sql.query(`SELECT * FROM blacklist WHERE userId = '${message.author.id}'`)).rows[0];
            if (row) {
                let row2 = (await sql.query(`SELECT * FROM blacklistmsg WHERE guildId = '${message.guild.id}'`)).rows[0];
                if (!row2 || row2.bool) {
                    msg = await message.channel.send(`You are blacklisted from me by: \`${row.by}\` and reason: \`${row.reason}\``);
                    client.msgEdit[message.id] = msg.id;
                }
            } else {
                let row2 = (await sql.query(`SELECT * FROM cooldownmsg WHERE guildId = '${message.guild.id}'`)).rows[0];
                if (client.cooldown.has(message.author.id)) {
                    if (row2 && row2.bool) {
                        msg = await message.channel.send("Please wait 3 seconds before executing a command.");
                        client.msgEdit[message.id] = msg.id;
                    }
                } else {
                    client.cooldown.add(message.author.id); // Adds the ID to the set
                    setTimeout(() => {
                        client.cooldown.delete(message.author.id); // Deletes the ID after 3 seconds
                    }, 3000);
                    commandThingy2();
                }
            }
        }
    }

    let r = (await sql.query(`SELECT * FROM prefix WHERE guildId = '${message.guild.id}'`)).rows[0];
    let regexp = new RegExp(`^<@!?${client.bot.user.id}> `);
    let prefix = message.content.match(regexp) ? message.content.match(regexp)[0] : (r ? r.customPrefix : "?");
    commandThingy(prefix);
});

// Events (action log)
client.events["guildMemberAdd"].func(client, sql, Discord);
client.events["guildMemberRemove"].func(client, sql, Discord);
client.events["guildMemberUpdate"].func(client, sql, Discord);
client.events["guildBanAdd"].func(client, sql, Discord);
client.events["emojiCreate"].func(client, sql, Discord);
client.events["emojiDelete"].func(client, sql, Discord);
client.events["guildBanRemove"].func(client, sql, Discord);
//client.events["guildCreate"].func(client, sql, Discord);
client.events["messageDelete"].func(client, sql, Discord);
client.events["messageUpdate"].func(client, sql, Discord);
client.events["roleCreate"].func(client, sql, Discord);
client.events["roleDelete"].func(client, sql, Discord);
client.events["roleUpdate"].func(client, sql, Discord);
client.events["messageDeleteBulk"].func(client, sql, Discord);
client.events["channelCreate"].func(client, sql, Discord);
client.events["channelDelete"].func(client, sql, Discord);
client.events["voiceStateUpdate"].func(client, sql, Discord);
//client.events["rateLimit"].func(client, sql, Discord);
client.events["raw"].func(client, sql, Discord);
// End of events

client.bot.login(process.env.BOT_TOKEN);
