module.exports = async (Client, message, args) => {
  if (!await Client.checkPerms('autorole', 'misc', message.member)) return message.reply(':x: Sorry, but you do not have the `misc.autorole` permission.');
  if (!args[1]) return message.reply('You have to declare what you want to do! Use `?help autorole` to see what you can do.');
  const options = ['add', 'remove', 'list', 'clear'];
  const option = args[1].toLowerCase();
  if (!options.includes(option)) return message.reply('That is not a valid first argument.');

  // Add
  if (option === options[0]) {
    if (!args[2]) return message.reply('You have to declare what role you want to add!');
    const role = message.guild.roles.get(args[2].replace(/[<>@&]/g, ''));
    if (!role) return message.reply('Your second argument was not a valid role!');
    const { rows: roles } = await Client.sql.query('SELECT roleid FROM autorole WHERE guildid = $1', [message.guild.id]);
    if (roles.some(r => r.roleid === role.id)) return message.reply('That role is already on the list!');
    Client.sql.query('INSERT INTO autorole (roleid, guildid) VALUES ($1, $2)', [role.id, message.guild.id]);
    return message.channel.send(`Successfully added ${role.name} to the autorole list.`);

  // Remove
  } else if (option === options[1]) {
    if (!args[2]) return message.reply('You have to declare what role you want to remove!');
    const role = message.guild.roles.get(args[2].replace(/[<>@&]/g, ''));
    if (!role) return message.reply('Your second argument was not a valid role!');
    const { rows: roles } = await Client.sql.query('SELECT roleid FROM autorole WHERE guildid = $1', [message.guild.id]);
    if (!roles.some(r => r.roleid === role.id)) return message.reply('That role is not on the list!');
    Client.sql.query('DELETE FROM autorole WHERE guildid = $1 AND roleid = $2', [message.guild.id, role.id]);
    return message.channel.send(`Successfully removed ${role.name} from the autorole list.`);

  // List
  } else if (option === options[2]) {
    const { rows: roles } = await Client.sql.query('SELECT roleid FROM autorole WHERE guildid = $1', [message.guild.id]);
    let str = roles.map(row => {
      const role = message.guild.roles.get(row.roleid);
      if (!role) {
        Client.sql.query('DELETE FROM autorole WHERE guildid = $1 AND roleid = $2', [message.guild.id, row.roleid]);
        return null;
      }
      return `${role.name} (${row.roleid})`;
    }).filter(e => e !== null).join('\n');
    if (roles.length === 0 || str.length === 0) return message.reply('The guild does not have any autoroles!');
    if (str.length <= 2048) {
      const embed = new Client.Discord.MessageEmbed()
        .setTitle(`${message.guild.name}'s Autorole List`)
        .setColor(0x00FFFF)
        .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL())
        .setDescription(str);
      return message.channel.send(embed);
    } else {
      const pages = [];
      let page = 1;
      str = '';
      roles.forEach(role => {
        if (str.length + role.name.length + role.roleid.length + 4 > 2048) {
          pages.push(str);
          str = '';
        }
        str += `${role.name} (${role.roleid})\n`;
      });
      if (str) pages.push(str);

      let embed = new Client.Discord.MessageEmbed()
        .setTitle(`${message.guild.name}'s Autorole List`)
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
          if (page === 1) return message.reply('You cannot go before page 1!').then(m => m.delete({ timeout: 5000 }).catch(() => {}));
          page--;
          return msg.edit(embed.setDescription(pages[page - 1]).setFooter(`Page ${page} of ${pages.length}`));

        // Forward
        } else if (reaction.emoji.name === emojis[0]) {
          if (page === pages.length) return message.reply(`You cannot go after page ${page}!`).then(m => m.delete({ timeout: 5000 }).catch(() => {}));
          page++;
          return msg.edit(embed.setDescription(pages[page - 1]).setFooter(`Page ${page} of ${pages.length}`));

        // Rewind
        } else if (reaction.emoji.name === emojis[4]) {
          if (page === 1) return message.reply('You cannot go before page 1!').then(m => m.delete({ timeout: 5000 }).catch(() => {}));
          page = 1;
          return msg.edit(embed.setDescription(pages[0]).setFooter(`Page ${page} of ${pages.length}`));

        // Very end
        } else if (reaction.emoji.name === emojis[3]) {
          if (page === pages.length) return message.reply(`You cannot go after page ${page}!`).then(m => m.delete({ timeout: 5000 }).catch(() => {}));
          page = pages.length;
          return msg.edit(embed.setDescription(pages[page - 1]).setFooter(`Page ${page} of ${pages.length}`));
        }
      });

      collector.on('end', () => {
        if (!forced && !msg.deleted) msg.reactions.filter(r => r.users.has(Client.bot.user.id)).forEach(r => r.users.remove(Client.bot.user));
      });
    }

  // Clear
  } else {
    const { rows: roles } = await Client.sql.query('SELECT roleid FROM autorole WHERE guildid = $1', [message.guild.id]);
    if (roles.length === 0) return message.reply('There are no roles on the list!');
    Client.sql.query('DELETE FROM autorole WHERE guildid = $1', [message.guild.id]);
    return message.channel.send('Successfully cleared the autorole list.');
  }
};

module.exports.help = {
  name: 'autorole',
  desc: 'Adds, removes, lists, or clears the autorole.',
  category: 'misc',
  usage: '?autorole add <Role>\n?autorole remove <Role>\n?autorole list\n?autorole clear',
  aliases: ['arole']
};
