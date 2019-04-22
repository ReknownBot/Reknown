/**
 * @param {import('../../structures/client.js')} Client
 * @param {import('discord.js').Message} message
 * @param {String[]} args
*/
module.exports = async (Client, message, args) => {
  if (!await Client.checkPerms('role', 'level', message.member)) return Client.functions.get('noCustomPerm')(message, 'level.role');

  if (!args[1]) return Client.functions.get('argMissing')(message.channel, 1, 'an action to execute (add, remove, list, or clear)');
  const options = ['add', 'remove', 'list', 'clear'];
  const choice = args[1].toLowerCase();
  if (!options.includes(choice)) return Client.functions.get('argFix')(Client, message.channel, 1, 'That action is invalid. It must be `add`, `remove`, `list`, or `clear`.');

  if (choice === options[0]) { // Add
    if (!args[2]) return Client.functions.get('argMissing')(message.channel, 2, 'a role to add for levelling rewards');

    const role = Client.getObj(args[2], { guild: message.guild, type: 'role' });
    if (!role) return Client.functions.get('argFix')(Client, message.channel, 2, 'Did not find a role with that argument.');

    const exists = (await Client.sql.query('SELECT * FROM levelrole WHERE guildid = $1 AND roleid = $2 LIMIT 1', [message.guild.id, role.id])).rows[0];
    if (exists) return Client.functions.get('argFix')(Client, message.channel, 2, 'Role is already on the level role list.');

    if (!args[3]) return Client.functions.get('argMissing')(message.channel, 3, 'a level requirement for when the members receive the role');

    const level = args[3];
    if (isNaN(level)) return Client.functions.get('argFix')(Client, message.channel, 3, 'The level requirement provided was not a number.');
    if (level < 1) return Client.functions.get('argFix')(Client, message.channel, 3, 'The level requirement may not be lower than 1.');
    if (level.includes('.')) return Client.functions.get('argFix')(Client, message.channel, 3, 'The level requirement may not include a decimal.');

    Client.sql.query('INSERT INTO levelrole (guildid, roleid, level) VALUES ($1, $2, $3)', [message.guild.id, role.id, level]);
    return message.channel.send(`Successfully added \`${role.name}\` to the level role with the level requirement of ${level}.`);
  } else if (choice === options[1]) { // Remove
    if (!args[2]) return Client.functions.get('argMissing')(message.channel, 2, 'a role to remove from levelling rewards');

    const role = Client.getObj(args[2], { guild: message.guild, type: 'role' });
    if (!role) return Client.functions.get('argFix')(Client, message.channel, 2, 'Did not find a role with that argument.');

    const exists = (await Client.sql.query('SELECT * FROM levelrole WHERE guildid = $1 AND roleid = $2 LIMIT 1', [message.guild.id, role.id])).rows[0];
    if (!exists) return Client.functions.get('argFix')(Client, message.channel, 2, 'The role is not on the levelling rewards.');

    Client.sql.query('DELETE FROM levelrole WHERE guildid = $1 AND roleid = $2', [message.guild.id, role.id]);
    return message.channel.send(`Successfully removed \`${role.name}\` from the level role list.`);
  } else if (choice === options[2]) { // List
    if (!Client.checkClientPerms(message.channel, 'EMBED_LINKS')) return Client.functions.get('noClientPerms')(message, ['Embed Links'], message.channel);

    const { rows: roles } = await Client.sql.query('SELECT * FROM levelrole WHERE guildid = $1 ORDER BY level ASC', [message.guild.id]);
    roles.forEach(r => {
      if (!message.guild.roles.get(r.roleid)) {
        Client.sql.query('DELETE FROM levelrole WHERE guildid = $1 AND roleid = $2', [message.guild.id, r.roleid]);
        roles.splice(roles.indexOf(r), 1);
      }
    });

    if (roles.length === 0) return message.reply('There are currently no level roles on this server!');

    const pages = Client.splitMessage(roles.map(r => {
      const role = message.guild.roles.get(r.roleid);
      return `${role} | ID **${role.id}** | Level **${r.level}**`;
    }).join('\n'), { maxLength: 2048 });
    if (pages instanceof Array) {
      if (!Client.checkClientPerms(message.channel, 'ADD_REACTIONS')) return Client.functions.get('noClientPerms')(message, ['Add Reactions'], message.channel);

      let page = 1;
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
          return msg.reactions.removeAll();

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
        if (!forced && !msg.deleted && Client.checkClientPerms(message.channel, 'ADD_REACTIONS')) msg.reactions.removeAll();
      });
    } else {
      const embed = new Client.Discord.MessageEmbed()
        .setTitle(`Level roles in ${message.guild.name}`)
        .setColor(0x00FFFF)
        .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL())
        .setDescription(pages);
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
