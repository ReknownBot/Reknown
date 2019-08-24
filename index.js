/* eslint-disable global-require */

require('dotenv').config();
const Discord = require('discord.js');
const fs = require('fs');
const sql = require('pg');

const client = new Discord.Client({
  disabledEvents: [ 'TYPING_START' ],
  disableEveryone: true,
  partials: [ 'MESSAGE', 'GUILD_MEMBER', 'USER' ]
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
client.dateformat = require('dateformat');
client.escMD = Discord.Util.escapeMarkdown;
client.fetch = require('node-fetch');
client.MessageEmbed = Discord.MessageEmbed;
client.splitMsg = Discord.Util.splitMessage;

client.query = pool.query.bind(pool);

const categories = fs.readdirSync('./commands');
client.commands = new Discord.Collection();
categories.forEach(name => fs.readdirSync(`./commands/${name}`).forEach(f => client.commands.set(f.slice(0, -3), require(`./commands/${name}/${f}`))));
client.events = new Discord.Collection(fs.readdirSync('./events').map(f => [ f.slice(0, -3), require(`./events/${f}`) ]));
client.functions = {};
fs.readdirSync('./functions').forEach(f => client.functions[f.slice(0, -3)] = require(`./functions/${f}`)); // eslint-disable-line no-return-assign
client.aliases = {};
client.commands.forEach((obj, name) => {
  obj.help.aliases.forEach(alias => client.aliases[alias] = name); // eslint-disable-line no-return-assign
  client.aliases[name] = name;
});
const temp = [];
client.categories = client.commands.map(c => {
  const category = c.help.category;
  if (temp.includes(category)) return null;
  temp.push(category);
  return category;
}).filter(c => c);

client.events.forEach((obj, name) => client.on(name, (...args) => obj.run(client, ...args)));

process.on('unhandledRejection', console.log);

client.login(process.env.BOT_TOKEN);
