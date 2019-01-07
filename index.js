const Discord = require('discord.js');
const bot = new Discord.Client({
  disableEveryone: true,
  disabledEvents: [
    'START_TYPING',
    'STOP_TYPING',
    'RELATIONSHIP_ADD',
    'RELATIONSHIP_REMOVE',
    'USER_SETTINGS_UPDATE',
    'USER_NOTE_UPDATE',
    'GUILD_SYNC'
  ]
});

require('array-utility');
require('dotenv').config();

const client = class {
  constructor () {
    this.fs = require('fs');

    this.commands = {};
    this.commandsList = [];
    const categories = this.fs.readdirSync('./commands');

    categories.forEach(c => {
      const files = this.fs.readdirSync(`./commands/${c}`).filter(f => f.endsWith('.js')).map(f => f.slice(0, -3));

      files.forEach(file => {
        this.commands[file] = require(`./commands/${c}/${file}.js`);
        this.commandsList.push(file);
      });
    });

    this.rollbar = new (require('rollbar'))(process.env.ROLLBAR_ACCESS_TOKEN);
    this.osu = new (require('node-osu')).Api(process.env.OSU_KEY);
    this.hypixel = new (require('hypixel-api'))(process.env.HYPIXEL_KEY);
    this.request = require('request');
    this.dateFormat = require('dateformat');
    this.fuzz = require('fuzzball');
    this.musicfn = require('./functions/music.js');
    this.sql = new (require('pg')).Pool({
      user: process.env.SQL_USER,
      password: process.env.SQL_PASS,
      database: process.env.SQL_DB,
      port: process.env.SQL_PORT,
      host: process.env.SQL_HOST,
      ssl: true
    });

    this.bot = bot;
    this.Discord = Discord;
    this.moment = require('moment');
    this.permissions = require('./permissions.json');
    this.escMD = this.Discord.Util.escapeMarkdown;
    this.contributors = ['468848409202262027', '284857002977525760'];
    this.mutes = new Discord.Collection();
    this.prefixes = {};

    const eventList = this.fs.readdirSync('./events').filter(f => f.endsWith('.js')).map(f => f.slice(0, -3));
    eventList.forEach(event => require(`./events/${event}.js`)(this));
  }

  capFirstLetter (str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  getFuzz (str) {
    const ordered = [];
    this.commandsList.forEach(cmd => {
      ordered.push([cmd, this.fuzz.ratio(str, cmd)]);
    });
    ordered.sort((a, b) => b[1] - a[1]);
    return ordered.slice(0, 3);
  }

  async checkPerms (pName, pCategory, member) {
    if (member.guild.owner === member || member.hasPermission('ADMINISTRATOR')) return true;

    const { rows } = await this.sql.query('SELECT roleid,bool FROM permissions WHERE pName = $1 AND pCategory = $2', [pName, pCategory]);
    const row = rows.find(r => member.roles.has(r.roleid));

    if (row && row.bool) return true;
    return false;
  }

  checkClientPerms (channel, ...perms) {
    let bool = true;
    perms.forEach(perm => {
      if (!channel.permissionsFor(this.bot.user).has(perm)) bool = false;
    });

    return bool;
  }

  matchInArray (expression, strings) {
    const len = strings.length;

    for (let i = 0; i < len; i++) {
      if (expression.test(strings[i])) return true;
    }

    return false;
  }

  get allAlias () {
    const allAliases = {};

    Object.values(this.commands).forEach(cmd => {
      const cmdName = cmd.help.name;
      cmd.help.aliases.forEach(alias => {
        allAliases[alias] = cmdName;
      });
      allAliases[cmdName] = cmdName;
    });

    return allAliases;
  }
};

const Client = new client();

bot.on('error', console.error);

bot.on('warn', i => {
  console.warn(i);
  return Client.rollbar.warn(i);
});

process.on('unhandledRejection', error => {
  console.error(error);
  return Client.rollbar.error(error);
});

bot.login(process.env.BOT_TOKEN);
