/* eslint no-redeclare: 0 */

const obj = {
  blacklistmsg: ['misc', 'blacklist'],
  cmdnotfound: ['misc', 'togglemsg'],
  cooldownmsg: ['misc', 'cooldownmsg'],
  deleteinvite: ['misc', 'invite'],
  goodbyemsg: ['misc', 'welcome'],
  logchannel: ['mod', 'log'],
  prefix: ['misc', 'prefix'],
  starchannel: ['misc', 'star'],
  togglelevel: ['level', 'options'],
  togglelog: ['mod', 'log'],
  togglestar: ['misc', 'star'],
  togglewelcome: ['misc', 'welcome'],
  updatechannel: ['misc', 'update'],
  welcomechnanel: ['misc', 'welcome'],
  welcomemsg: ['misc', 'welcome']
};

module.exports = async (Client, message, args) => {
  const option = args[1] ? args[1].toLowerCase() : null;
  if (!option) return message.reply('You have to provide an option to change!');
  if (!Object.keys(obj).includes(option)) return message.reply('That option is not valid. Use `?help config` to see all the options.');
  if (!await Client.checkPerms(option, obj[option][1], message.member)) return message.reply(`:x: Sorry, but you do not have the \`${option}.${obj[option][1]}\` permission.`);

  const value = args[2] ? args[2].toLowerCase() : null;
  if (!value) return message.reply('You have to provide a value for the option!');

  switch (option) {
    case 'blacklistmsg':
      if (value !== 'true' && value !== 'false') return message.reply('The value you provided is invalid! That option takes `true` or `false`.');
      const bool = value === 'true' ? 1 : 0;
      const row = (await Client.sql.query('SELECT bool FROM blacklistmsg WHERE guildid = $1', [message.guild.id])).rows[0];
      if ((!row && bool === 1) || row.bool === bool) return message.reply('The value you provided is the same as the current one!');

      if (!row) Client.sql.query('INSERT INTO blacklistmsg (guildid, bool) VALUES ($1, $2)', [message.guild.id, bool]);
      else Client.sql.query('UPDATE blacklistmsg SET bool = $1 WHERE guildid = $2', [bool, message.guild.id]);
      return message.channel.send(`Successfully updated \`${option}\` to \`${value}\`.`);
    case 'cmdnotfound':
      if (value !== 'true' && value !== 'false') return message.reply('The value you provided is invalid! That option takes `true` or `false`.');
      const bool = value === 'true' ? 1 : 0;
      const row = (await Client.sql.query('SELECT bool FROM cmdnotfound WHERE guildid = $1', [message.guild.id])).rows[0];
      if ((!row && bool === 0) || row.bool === bool) return message.reply('The value you provided is the same as the current one!');

      if (!row) Client.sql.query('INSERT INTO cmdnotfound (guildid, bool) VALUES ($1, $2)', [message.guild.id, bool]);
      else Client.sql.query('UPDATE cmdnotfound SET bool = $1 WHERE guildid = $2', [bool, message.guild.id]);
      return message.channel.send(`Successfully updated \`${option}\` to \`${value}\`.`);
    case 'cooldownmsg':
      if (value !== 'true' && value !== 'false') return message.reply('The value you provided is invalid! That option takes `true` or `false`.');
      const bool = value === 'true' ? 1 : 0;
      const row = (await Client.sql.query('SELECT bool FROM blacklistmsg WHERE guildid = $1', [message.guild.id])).rows[0];
      if ((!row && bool === 1) || row.bool === bool) return message.reply('The value you provided is the same as the current one!');

      if (!row) Client.sql.query('INSERT INTO blacklistmsg (guildid, bool) VALUES ($1, $2)', [message.guild.id, bool]);
      else Client.sql.query('UPDATE blacklistmsg SET bool = $1 WHERE guildid = $2', [bool, message.guild.id]);
      return message.channel.send(`Successfully updated \`${option}\` to \`${value}\`.`);
    case 'deleteinvite':
      if (value !== 'true' && value !== 'false') return message.reply('The value you provided is invalid! That option takes `true` or `false`.');
      const bool = value === 'true' ? 1 : 0;
      const row = (await Client.sql.query('SELECT bool FROM deleteinvite WHERE guildid = $1', [message.guild.id])).rows[0];
      if ((!row && bool === 1) || row.bool === bool) return message.reply('The value you provided is the same as the current one!');

      if (!row) Client.sql.query('INSERT INTO deleteinvite (guildid, bool) VALUES ($1, $2)', [message.guild.id, bool]);
      else Client.sql.query('UPDATE deleteinvite SET bool = $1 WHERE guildid = $2', [bool, message.guild.id]);
      return message.channel.send(`Successfully updated \`${option}\` to \`${value}\`.`);
    case 'goodbyemsg':
      const msg = args.slice(2).join(' ');
      if (msg.length >= 1000) return message.reply('Please keep the message length less than a thousand characters.');

      const row = (await Client.sql.query('SELECT goodbyemessage FROM goodbyemessages WHERE guildid = $1', [message.guild.id])).rows[0];
      if (!row) Client.sql.query('INSERT INTO goodbyemessages (guildid, custommessage) VALUES ($1, $2)', [message.guild.id, msg]);
      else Client.sql.query('UPDATE goodbyemessages SET custommessage = $1 WHERE guildid = $2', [msg, message.guild.id]);
      return message.channel.send(`Successfully updated \`${option}\` to \`${Client.escapeMarkdown(msg)}\`.`);
    case 'logchannel':
      const channel = message.guild.channels.get(value.replace(/[<>#]/g, ''));
      if (!channel) return message.reply('That channel is invalid!');

      const row = (await Client.sql.query('SELECT * FROM logchannel WHERE guildid = $1', [message.guild.id])).rows[0];
      if (!row) Client.sql.query('INSERT INTO logchannel (guildid, channelid) VALUES ($1, $2)', [message.guild.id, channel.id]);
      else Client.sql.query('UPDATE logchannel SET channelid = $1 WHERE guildid = $2', [channel.id, message.guild.id]);
      return message.channel.send(`Successfully updated \`${option}\` to ${channel}.`);
    case 'prefix':
      const prefix = args.slice(2).join(' ');
      if (prefix.length > 15) return message.reply('Please keep the prefix length under 16 characters.');

      const row = (await Client.sql.query('SELECT customprefix FROM prefix WHERE guildid = $1', [message.guild.id])).rows[0];
      if (prefix === (row ? row.customprefix : '?')) return message.reply('The prefix is already set to that!');

      if (!row) Client.sql.query('INSERT INTO prefix (guildid, customprefix) VALUES ($1, $2)', [message.guild.id, prefix]);
      else Client.sql.query('UPDATE prefix SET customprefix = $1 WHERE guildid = $2', [prefix, message.guild.id]);
      return message.channel.send(`Successfully updated \`${option}\` to \`${Client.escapeMarkdown(prefix)}\`.`);
  }
};

module.exports.help = {
  name: 'config',
  desc: 'Sets up config settings.',
  category: 'util',
  usage: '?config <Option> <Value>',
  aliases: ['settings']
};
