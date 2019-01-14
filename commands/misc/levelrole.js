module.exports = async (Client, message, args) => {
  if (!await Client.checkPerms('role', 'level', message.member)) return message.reply(':x: Sorry, but you do not have the `level.role` permission.');

  if (!args[1]) return message.reply('You have to put an action to execute!');
  const options = ['add', 'remove', 'list', 'clear'];
  const choice = args[1].toLowerCase();
  if (!options.includes(choice)) return message.reply('That action is invalid!');

  if (choice === options[0]) { // Add
    if (!args[2]) return message.reply('You have to provide a role for me to add to the level role!');

    const role = Client.getObj(args[2], { guild: message.guild, type: 'role' });
    if (!role) return message.reply('The role you provided was invalid!');

    const exists = (await Client.sql.query('SELECT * FROM levelrole WHERE guildid = $1 AND roleid = $2 LIMIT 1', [message.guild.id, role.id])).rows[0];
    if (exists) return message.reply('That role is already on the levelrole list!');

    if (!args[3]) return message.reply('You have to provide a level requirement for when the members receive the role!');

    const level = args[3];
    if (isNaN(level)) return message.reply('The level requirement you provided was not a number!');
    if (level < 1) return message.reply('The level requirement may not be lower than 1!');
    if (level.includes('.')) return message.reply('The level requirement may not be a decimal!');

    Client.sql.query('INSERT INTO levelrole (guildid, roleid, level) VALUES ($1, $2, $3)', [message.guild.id, role.id, level]);
    return message.channel.send(`Successfully added \`${role.name}\` to the level role with the level requirement of ${level}.`);
  } else if (choice === options[1]) { // Remove
    if (!args[2]) return message.reply('You have to provide a role for me to remove!');

    const role = Client.getObj(args[2], { guild: message.guild, type: 'role' });
    if (!role) return message.reply('The role you provided was invalid!');

    const exists = (await Client.sql.query('SELECT * FROM levelrole WHERE guildid = $1 AND roleid = $2 LIMIT 1', [message.guild.id, role.id])).rows[0];
    if (!exists) return message.reply('That role is not in the level role list!');

    Client.sql.query('DELETE FROM levelrole WHERE guildid = $1 AND roleid = $2', [message.guild.id, role.id]);
    return message.channel.send(`Successfully removed \`${role.name}\` from the level role list.`);
  } else if (choice === options[2]) { // List
    const { rows: roles } = await Client.sql.query('SELECT * FROM levelrole WHERE guildid = $1 ORDER BY level ASC', [message.guild.id]);
    roles.forEach(r => {
      if (!message.guild.roles.get(r.roleid)) {
        Client.sql.query('DELETE FROM levelrole WHERE guildid = $1 AND roleid = $2', [message.guild.id, r.roleid]);
        roles.splice(roles.indexOf(r), 1);
      }
    });

    if (roles.length === 0) return message.reply('There are currently no level roles on this server!');

    let str = roles.map(r => {
      const role = message.guild.roles.get(r.roleid);
      return `${role} | ID: ${role.id} | Level: ${r.level}`;
    }).join('\n');
    if (str.length > 2048) {
      str = '';
      let page = 1;
      const pages = [];

      roles.forEach(r => {
        const role = message.guild.roles.get(r.roleid);
        if (str.length + 18 + role.id.length + role.toString().length + r.level.toString().length > 2048) {
          pages.push(str);
          str = '';
        }

        str += `${role} | ID: ${role.id} | Level: ${r.level}`;
      });
      if (str) pages.push(str);

      const embed = new Client.Discord.MessageEmbed()
        .setTitle(`${message.guild.name}'s Level Role List`)
        .setColor(0x00FFFF)
        .setFooter(`Page ${page} of ${pages.length}`)
        .setDescription(pages[0]);
      const msg = await message.channel.send(embed);
      const emojis = ['▶', '◀', '⏹', '⏩', '⏪'];
      await msg.react(emojis[4]);
      await msg.react(emojis[1]);
      await msg.react(emojis[2]);
      await msg.react(emojis[0]);
      await msg.react(emojis[3]);

      const filter = (reaction, user) => emojis.includes(reaction.emoji.name) && user.id === message.author.id;
      const collector = msg.createReactionCollector(filter, { time: 60000 });
      let forced = false;

      collector.on('collect', reaction => {
        // Stop
        if (reaction.emoji.name === emojis[2]) {
          forced = true;
          collector.stop();
          return msg.reactions.filter(r => r.users.has(Client.bot.user.id)).forEach(r => r.users.remove(Client.bot.user));

          // Backward
        } else if (reaction.emoji.name === emojis[1]) {
          if (page === 1) return message.reply('You cannot go before page 1!').then(m => m.delete({ timeout: 5000 }).catch(() => { }));
          page--;
          return msg.edit(embed.setDescription(pages[page - 1]).setFooter(`Page ${page} of ${pages.length}`));

          // Forward
        } else if (reaction.emoji.name === emojis[0]) {
          if (page === pages.length) return message.reply(`You cannot go after page ${page}!`).then(m => m.delete({ timeout: 5000 }).catch(() => { }));
          page++;
          return msg.edit(embed.setDescription(pages[page - 1]).setFooter(`Page ${page} of ${pages.length}`));

          // Rewind
        } else if (reaction.emoji.name === emojis[4]) {
          if (page === 1) return message.reply('You cannot go before page 1!').then(m => m.delete({ timeout: 5000 }).catch(() => { }));
          page = 1;
          return msg.edit(embed.setDescription(pages[0]).setFooter(`Page ${page} of ${pages.length}`));

          // Very end
        } else if (reaction.emoji.name === emojis[3]) {
          if (page === pages.length) return message.reply(`You cannot go after page ${page}!`).then(m => m.delete({ timeout: 5000 }).catch(() => { }));
          page = pages.length;
          return msg.edit(embed.setDescription(pages[page - 1]).setFooter(`Page ${page} of ${pages.length}`));
        }
      });

      collector.on('end', () => {
        if (!forced && !msg.deleted) msg.reactions.filter(r => r.users.has(Client.bot.user.id)).forEach(r => r.users.remove(Client.bot.user));
      });
    } else {
      const embed = new Client.Discord.MessageEmbed()
        .setTitle(`Level roles in ${message.guild.name}`)
        .setColor(0x00FFFF)
        .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL())
        .setDescription(str);
      return message.channel.send(embed);
    }
  } else if (choice === options[3]) { // Clear
    const { rows } = await Client.sql.query('SELECT * FROM levelrole WHERE guildid = $1', [message.guild.id]);
    if (rows.length === 0) return message.reply('There are no current levelroles on this server!');
    Client.sql.query('DELETE FROM levelrole WHERE guildid = $1', [message.guild.id]);
    return message.channel.send('Successfully cleared the level role list.');
  }
};

module.exports.help = {
  name: 'levelrole',
  desc: 'Adds, removes, lists, or clears the level role! It will only take effect when the leveling system is toggled on.',
  category: 'misc',
  usage: '?levelrole add <Role> <Level Requirement>\n?levelrole remove <Role>\n?levelrole list\n?levelrole clear',
  aliases: ['lrole']
};
