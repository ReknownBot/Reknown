/**
 * @param {import('../../structures/client.js')} Client
 * @param {import('discord.js').Message} message
 * @param {String[]} args
*/
module.exports = async (Client, message, args) => {
  if (!args[1]) return Client.functions.get('argMissing')(message.channel, 1, 'an option to run (add, remove, list, or view)');

  const options = ['add', 'remove', 'list', 'view'];
  const option = args[1].toLowerCase();
  if (!options.includes(option)) return Client.functions.get('argFix')(Client, message.channel, 1, 'The option provided was invalid. It must be `add`, `remove`, `list`, or `view`.');

  let serverTag = false;
  if (Client.matchInArray(/-s/g, args)) {
    args.splice(args.indexOf('-s'), 1);
    serverTag = true;
  }

  if (option === options[0]) { // Add
    if (!args[2]) return Client.functions.get('argMissing')(message.channel, 2, 'a tag name');
    const tagName = args.slice(2).join(' ').toLowerCase();
    if (tagName.length > 50) return Client.functions.get('argFix')(Client, message.channel, 2, 'The tag name must not exceed 50 characters.');

    if (serverTag) { // Server tags
      if (!await Client.checkPerms('edit', 'tag', message.member)) return Client.functions.get('noCustomPerm')(message, 'tag.edit');
      const exists = (await Client.sql.query('SELECT * FROM guildtag WHERE tagname = $1 AND guildid = $2 LIMIT 1', [tagName, message.guild.id])).rows[0];
      if (exists) return Client.functions.get('argFix')(Client, message.channel, 2, `There is already a tag named \`${Client.escMD(tagName)}\` in the server.`);

      message.reply('What should the tag\'s content be? You can also reply with `cancel`.');

      const filter = m => m.author.id === message.author.id && m.channel.id === message.channel.id;
      const msg = (await message.channel.awaitMessages(filter, { max: 1 })).first();
      if (msg.content === 'cancel') return message.reply('Cancelled command.');
      if (!msg.content) return message.reply('You have to provide actual characters!');
      Client.sql.query('INSERT INTO guildtag (guildid, tagcontent, tagname) VALUES ($1, $2, $3)', [message.guild.id, msg.content, tagName]);
      return message.channel.send(`Successfully added a server tag named ${tagName}.`);
    } else { // Personal tags
      const exists = (await Client.sql.query('SELECT * FROM usertag WHERE tagname = $1 AND userid = $2 LIMIT 1', [tagName, message.author.id])).rows[0];
      if (exists) return Client.functions.get('argFix')(Client, message.channel, 2, `There is already a tag named \`${Client.escMD(tagName)}\` in your personal tags.`);

      message.reply('What should the tag\'s content be? You can also reply with `cancel`.');

      const filter = m => m.author.id === message.author.id && m.channel.id === message.channel.id;
      const msg = (await message.channel.awaitMessages(filter, { max: 1 })).first();
      if (msg.content === 'cancel') return message.reply('Cancelled command.');
      if (!msg.content) return message.reply('You have to provide actual characters!');
      Client.sql.query('INSERT INTO usertag (userid, tagcontent, tagname) VALUES ($1, $2, $3)', [message.author.id, msg.content, tagName]);
      return message.channel.send(`Successfully added a tag named ${tagName}.`);
    }
  } else if (option === options[1]) { // Remove
    if (!args[2]) return Client.functions.get('argMissing')(message.channel, 2, 'a tag name to remove');
    const tagName = args.slice(2).join(' ').toLowerCase();

    if (serverTag) { // Server tags
      if (!await Client.checkPerms('edit', 'tag', message.member)) return Client.functions.get('noCustomPerm')(message, 'tag.edit');
      const exists = (await Client.sql.query('SELECT * FROM guildtag WHERE tagname = $1 AND guildid = $2 LIMIT 1', [tagName, message.guild.id])).rows[0];
      if (!exists) return Client.functions.get('argFix')(Client, message.channel, 2, `A tag named \`${Client.escMD(tagName)}\` does not exist in the server.`);

      Client.sql.query('DELETE FROM guildtag WHERE guildid = $1 AND tagname = $2', [message.guild.id, tagName]);
      return message.channel.send(`Successfully removed a server tag named ${tagName}.`);
    } else { // Personal tags
      if (!await Client.checkPerms('edit', 'tag', message.member)) return Client.functions.get('noCustomPerm')(message, 'tag.edit');
      const exists = (await Client.sql.query('SELECT * FROM usertag WHERE userid = $1 AND tagname = $2 LIMIT 1', [message.author.id, tagName])).rows[0];
      if (!exists) return Client.functions.get('argFix')(Client, message.channel, 2, `A tag named \`${Client.escMD(tagName)}\` does not exist in your personal tags.`);

      Client.sql.query('DELETE FROM usertag WHERE userid = $1 AND tagname = $2', [message.author.id, tagName]);
      return message.channel.send(`Successfully removed a tag named ${tagName}.`);
    }
  } else if (option === options[2]) { // List
    if (!Client.checkClientPerms(message.channel, 'EMBED_LINKS')) return Client.functions.get('noClientPerms')(message, ['Embed Links'], message.channel);

    let rows;
    if (serverTag) { // Server tags
      ({ rows } = await Client.sql.query('SELECT * FROM guildtag WHERE guildid = $1', [message.guild.id]));
      if (!rows[0]) return message.reply('There are currently no server tags!');
    } else { // Personal tags
      ({ rows } = await Client.sql.query('SELECT * FROM usertag WHERE userid = $1', [message.author.id]));
      if (!rows[0]) return message.reply('You currently do not have any tags!');
    }

    const tagArray = rows.map(r => r.tagname);
    const str = tagArray.list();

    if (str.length > 2048) {
      const pages = Client.splitMessage(str, { maxLength: 2048, char: ', ' });
      let page = 1;

      const embed = new Client.Discord.MessageEmbed()
        .setTitle(serverTag ? `Server Tags in ${message.guild.name}` : 'Your Tags')
        .setDescription(pages[0])
        .setColor(0x00FFFF)
        .setFooter(`Page ${page} of ${pages.length} | Requested by ${message.author.tag}`, message.author.displayAvatarURL());
      const msg = await message.channel.send(embed);

      const emojis = ['◀', '▶'];
      const filter = (r, u) => u.id === message.author.id && emojis.includes(r.name);
      const collector = msg.createReactionCollector(filter, { time: 60000 });

      collector.on('collect', reaction => {
        if (reaction === emojis[0]) { // Back
          if (page === 1) return message.reply('You cannot go before page 1!').then(m => m.delete(3000).catch(() => { }));

          page--;
          msg.edit(embed.setDescription(pages[page - 1]).setFooter(`Page ${page} of ${pages.length} | Requested by ${message.author.tag}`, message.author.displayAvatarURL()));
        } else { // Forward
          if (page === pages.length) return message.reply(`You cannot go after page ${page}!`).then(m => m.delete(3000).catch(() => { }));

          page++;
          msg.edit(embed.setDescription(pages[page - 1]).setFooter(`Page ${page} of ${pages.length} | Requested by ${message.author.tag}`, message.author.displayAvatarURL()));
        }
      });
    } else {
      const embed = new Client.Discord.MessageEmbed()
        .setTitle(serverTag ? `Server Tags in ${message.guild.name}` : 'Your Tags')
        .setDescription(str)
        .setColor(0x00FFFF)
        .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL());
      return message.channel.send(embed);
    }
  } else if (option === options[3]) { // View
    if (!args[2]) return Client.functions.get('argMissing')(message.channel, 2, 'a tag name to display');
    const tagName = args.slice(2).join(' ').toLowerCase();
    let row;

    if (serverTag) { // Server Tag
      row = (await Client.sql.query('SELECT * FROM guildtag WHERE guildid = $1 AND tagname = $2', [message.guild.id, tagName])).rows[0];
    } else { // Personal Tag
      row = (await Client.sql.query('SELECT * FROM usertag WHERE userid = $1 AND tagname = $2', [message.author.id, tagName])).rows[0];
    }

    if (!row) return message.reply('The tag you provided does not exist!');

    return message.channel.send(row.tagcontent);
  }
};

module.exports.help = {
  name: 'tag',
  desc: 'Adds, removes, lists, or views your personal or the server\'s tags. Use the `-s` option to make it interact with the server tags.',
  category: 'util',
  usage: '?tag add <Tag Name> [-s]\n?tag remove <Tag Name> [-s]\n?tag list [-s]\n?tag view <Tag Name> [-s]',
  aliases: []
};
