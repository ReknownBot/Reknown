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
  ],
  partials: ['MESSAGE']
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
    this.request = require('request');
    this.dateFormat = require('dateformat');
    this.fuzz = require('fuzzball');
    this.sql = new (require('pg')).Pool({
      user: process.env.SQL_USER,
      password: process.env.SQL_PASS,
      database: process.env.SQL_DB,
      port: process.env.SQL_PORT,
      host: process.env.SQL_HOST,
      ssl: true
    });
    this.fetch = require('node-fetch');

    this.bot = bot;
    this.Discord = Discord;
    this.moment = require('moment');
    this.permissions = require('./permissions.json');
    this.escMD = this.Discord.Util.escapeMarkdown;
    this.splitMessage = this.Discord.Util.splitMessage;
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

    return !!(row && row.bool);
  }

  checkClientPerms (channel, ...perms) {
    return perms.some(perm => channel.permissionsFor(this.bot.user).has(perm));
  }

  matchInArray (expression, strings) {
    return strings.some(str => expression.test(str));
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

  getObj (mention, options) {
    const type = options.type;
    const guild = options.guild;

    if (type === 'member' || type === 'user') {
      if (mention.startsWith('<@')) {
        mention = mention.slice(2, -1);
        if (mention.startsWith('!')) mention = mention.slice(1);
      }

      if (type === 'member') return guild.members.get(mention);
      return this.bot.users.fetch(mention).catch(() => false);
    } else if (type === 'channel') {
      const filter = options.filter;
      if (mention.startsWith('<#')) mention = mention.slice(2, -1);

      if (!filter) return guild.channels.get(mention);
      return guild.channels.find(chan => chan.type === filter && chan.id === mention);
    } else if (type === 'role') {
      if (mention.startsWith('<@&')) mention = mention.slice(3, -1);

      return guild.roles.get(mention);
    }
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
