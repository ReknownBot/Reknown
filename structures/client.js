const Discord = require('discord.js');
const fs = require('fs');
const fuzz = require('fuzzball');
const sql = new (require('pg')).Pool({
  user: process.env.SQL_USER,
  password: process.env.SQL_PASS,
  database: process.env.SQL_DB,
  port: process.env.SQL_PORT,
  host: process.env.SQL_HOST,
  ssl: true
});

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

/**
 * @typedef {Object} Client
 * @prop {Discord.Client} bot
 * @prop {function(str: String): String} capFirstLetter
 * @prop {function(Discord.GuildChannel, ...String): Boolean} checkClientPerms
 * @prop {function(String, String, Discord.GuildMember): Boolean} checkPerms
 * @prop {Object} commands
 * @prop {String[]} commandsList
 * @prop {String[]} contributors
 * @prop {import('dateformat')} dateFormat
 * @prop {Discord} Discord
 * @prop {Discord.Util.escapeMarkdown} escMD
 * @prop {import('node-fetch')} fetch
 * @prop {String[]} fnList
 * @prop {Discord.Collection<String, Function>} functions
 * @prop {function(String): Array<Array<String|Number>>} getFuzz
 * @prop {function(String, Object): Discord.User|Discord.GuildChannel|Discord.GuildMember|Discord.Role|Boolean} getObj
 * @prop {function(RegExp, String[])} matchInArray
 * @prop {import('moment')} moment
 * @prop {Discord.Collection<String, Number>} mutes
 * @prop {Object} permissions
 * @prop {Object} prefixes
 * @prop {import('rollbar')} rollbar
 * @prop {Discord.Util.splitMessage} splitMessage
 * @prop {import('pg').Pool} sql
 */

/**
 * @type {Client}
 */
const client = {
  commands: {},
  commandsList: [],

  functions: new Discord.Collection(),
  fnList: fs.readdirSync('./functions').filter(f => f.endsWith('.js')).map(f => f.slice(0, -3)),

  rollbar: new (require('rollbar'))(process.env.ROLLBAR_ACCESS_TOKEN),
  dateFormat: require('dateformat'),
  fetch: require('node-fetch'),
  moment: require('moment'),
  sql: sql,
  permissions: require('../permissions.json'),

  bot: bot,
  Discord: Discord,

  escMD: Discord.Util.escapeMarkdown,
  splitMessage: Discord.Util.splitMessage,

  contributors: ['468848409202262027', '284857002977525760'],

  mutes: new Discord.Collection(),
  prefixes: {},

  capFirstLetter: (str) => str.charAt(0).toUpperCase() + str.slice(1),

  checkPerms: async (pName, pCategory, member) => {
    if (member.guild.owner === member || member.hasPermission('ADMINISTRATOR')) return true;

    const { rows } = await sql.query('SELECT roleid,bool FROM permissions WHERE pName = $1 AND pCategory = $2', [pName, pCategory]);
    const row = rows.find(r => member.roles.has(r.roleid));

    return !!(row && row.bool);
  },

  checkClientPerms: (channel, ...perms) => channel.permissionsFor(bot.user).has(perms),

  matchInArray: (expression, strings) => strings.some(str => expression.test(str)),

  getObj: (mention, options) => {
    const type = options.type;

    const guild = options.guild;

    if (type === 'member' || type === 'user') {
      if (mention.startsWith('<@')) {
        mention = mention.slice(2, -1);
        if (mention.startsWith('!')) mention = mention.slice(1);
      }

      if (type === 'member') return guild.members.get(mention);
      return bot.users.fetch(mention).catch(() => false);
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

client.getFuzz = (str) => {
  const ordered = [];

  client.commandsList.forEach(cmd => {
    ordered.push([cmd, fuzz.ratio(str, cmd)]);
  });
  ordered.sort((a, b) => b[1] - a[1]);
  return ordered.slice(0, 3);
};

fs.readdirSync('./commands').forEach(c => {
  const files = fs.readdirSync(`./commands/${c}`).filter(f => f.endsWith('.js')).map(f => f.slice(0, -3));

  files.forEach(file => {
    client.commands[file] = require(`../commands/${c}/${file}.js`);
    client.commandsList.push(file);
  });
});

client.fnList.forEach(fn => client.functions.set(fn, require(`../functions/${fn}.js`)));

const allAliases = {};
Object.values(client.commands).forEach(cmd => {
  const cmdName = cmd.help.name;
  cmd.help.aliases.forEach(alias => {
    allAliases[alias] = cmdName;
  });
  allAliases[cmdName] = cmdName;
});

client.allAlias = allAliases;

const eventList = fs.readdirSync('./events').filter(f => f.endsWith('.js')).map(f => f.slice(0, -3));
eventList.forEach(event => require(`../events/${event}.js`)(client));

module.exports = client;
