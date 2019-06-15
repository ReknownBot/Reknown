require('dotenv').config();
const Discord = require('discord.js');
const fs = require('fs');
const sql = require('pg');

const client = new Discord.Client({
  disabledEvents: ['TYPING_START'],
  disableEveryone: true,
  partials: ['MESSAGE', 'GUILD_MEMBER', 'USER']
});
const pool = new sql.Pool({
  database: process.env.SQL_DB,
  host: process.env.SQL_HOST,
  password: process.env.SQL_PASS,
  port: process.env.SQL_PORT,
  user: process.env.SQL_USER,
  ssl: true
});

client.Discord = Discord;
client.config = require('./config.json');
client.escMD = Discord.Util.escapeMarkdown;
client.splitMsg = Discord.Util.splitMessage;

client.query = pool.query.bind(pool);

client.commands = new Discord.Collection(fs.readdirSync('./commands').map(f => [f.slice(0, -3), require(`./commands/${f}`)]));
client.events = new Discord.Collection(fs.readdirSync('./events').map(f => [f.slice(0, -3), require(`./events/${f}`)]));
client.functions = {};
fs.readdirSync('./functions').forEach(f => client.functions[f.slice(0, -3)] = require(`./functions/${f}`));
client.aliases = {};
client.commands.forEach((obj, name) => {
  obj.help.aliases.forEach(alias => client.aliases[alias] = name);
  client.aliases[name] = name;
});

client.events.forEach((obj, name) => client.on(name, (...args) => obj.run(client, ...args)));

process.on('unhandledRejection', console.log);

client.login(process.env.BOT_TOKEN);
