const cooldowns = {};

/**
 * @param {import('../structures/client.js')} Client
 */
module.exports = Client => {
  return Client.bot.on('message', async message => {
    if (message.author.bot) return;
    if (!message.guild || !message.guild.available) return;
    if (message.webhookID) return;

    if (message.member.partial) await message.member.fetch();

    if (!message.channel.permissionsFor(Client.bot.user).has(['VIEW_CHANNEL', 'SEND_MESSAGES'])) return;

    if (!message.edits[1]) Client.functions.get('level')(Client, message);
    Client.functions.get('deleteinvite')(Client, message);
    Client.functions.get('eco')(Client, message.member);

    const row = (await Client.sql.query('SELECT customprefix FROM prefix WHERE guildid = $1', [message.guild.id])).rows[0];

    if (!Client.prefixes[message.guild.id]) {
      Client.prefixes[message.guild.id] = row ? row.customprefix : '?';
    }

    const prefix = Client.prefixes[message.guild.id];
    const regexp = new RegExp(`^<@!?${message.client.user.id}> `);
    if ((!message.content.startsWith(prefix) && !message.content.match(regexp)) || message.content === prefix) return;

    let args;

    if (message.content.match(regexp)) args = message.content.slice(message.content.match(regexp)[0].length).split(/ +/g);
    else args = message.content.slice(prefix.length).split(/ +/g);

    const command = args[0].toLowerCase();
    if (!(command in Client.commands) && !Client.allAlias[command]) {
      const unknownCmd = (await Client.sql.query('SELECT * FROM cmdnotfound WHERE guildid = $1 AND bool = $2', [message.guild.id, 1])).rows[0];
      if (unknownCmd) {
        const cmds = Client.getFuzz(command);

        message.reply(`I did not find that command. Did you mean \`${cmds[0][0]}, ${cmds[1][0]}, or ${cmds[2][0]}\`?`);
      }
      return;
    }

    if (await Client.functions.get('blacklist')(Client, message.member)) {
      const obj = await Client.functions.get('blacklist')(Client, message.member);
      if (obj === 'disabled') return;
      return message.reply(`You are blacklisted by ${obj.by} for the reason of \`${Client.escMD(obj.reason)}\`.`);
    }

    if (await Client.functions.get('gblacklist')(Client, message.member)) {
      const reason = await Client.functions.get('gblacklist')(Client, message.member);
      return message.reply(`You are globally blacklisted from me for the reason of \`${Client.escMD(reason)}\`. You may appeal in my support server.`);
    }

    if (cooldowns[message.author.id]) {
      const now = Date.now();
      const cooldownMsg = (await Client.sql.query('SELECT * FROM cooldownmsg WHERE guildid = $1 AND bool = $2', [message.guild.id, 1])).rows[0];
      if (cooldownMsg) message.reply(`You are still on cooldown! Please try again in \`${Math.round((1000 - (now - cooldowns[message.author.id])) / 10) / 100}s\`.`);
      return;
    }
    cooldowns[message.author.id] = Date.now();
    setTimeout(() => delete cooldowns[message.author.id], 1000);

    if (command in Client.commands) return Client.commands[command](Client, message, args);
    else {
      for (const val in Client.allAlias) {
        const prop = Client.allAlias[val];
        if (val === command) {
          Client.commands[prop](Client, message, args);
          break;
        }
      }
    }
  });
};
