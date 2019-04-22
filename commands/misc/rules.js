/**
 * @param {import('../../structures/client.js')} Client
 * @param {import('discord.js').Message} message
 * @param {String[]} args
*/
module.exports = async (Client, message, args) => {
  if (!args[1]) {
    const rules = (await Client.sql.query('SELECT rule FROM rules WHERE guildid = $1', [message.guild.id])).rows.map((r, index) => `**${index + 1}.** ${r.rule}`);
    if (rules.length === 0) return message.reply('There are currently no rules on this server!');
    const pages = Client.splitMessage(rules.join('\n'), { maxLength: 2048 });
    if (typeof pages === 'string') {
      const embed = new Client.Discord.MessageEmbed()
        .setTitle(`Rules in ${message.guild.name}`)
        .setColor(0x00FFFF)
        .setDescription(pages);

      return message.author.send(embed)
        .then(() => message.channel.send('Check your DMs!'))
        .catch(() => {
          if (!Client.checkClientPerms(message.channel, 'EMBED_LINKS')) return Client.functions.get('noClientPerms')(message, ['Embed Links'], message.channel);
          message.channel.send(embed.setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL()));
        });
    } else {
      if (!Client.checkClientPerms(message.channel, 'ADD_REACTIONS')) return Client.functions.get('noClientPerms')(message, ['Add Reactions'], message.channel);

      let page = 1;

      const embed = new Client.Discord.MessageEmbed()
        .setTitle(`Rules in ${message.guild.name}`)
        .setColor(0x00FFFF)
        .setFooter(`Page 1 of ${pages.length}`)
        .setDescription(pages[0]);

      let msg = await message.author.send(embed).catch(() => null);
      if (!msg) {
        if (!Client.checkClientPerms(message.channel, 'EMBED_LINKS')) return Client.functions.get('noClientPerms')(message, ['Embed Links'], message.channel);
        msg = await message.channel.send(embed);
      } else message.channel.send('Check your DMs!');
      const emojis = ['⏪', '◀', '⏹', '▶', '⏩'];
      await msg.react(emojis[0]);
      await msg.react(emojis[1]);
      await msg.react(emojis[2]);
      await msg.react(emojis[3]);
      await msg.react(emojis[4]);

      const filter = (reaction, user) => emojis.includes(reaction.emoji.name) && user.id === message.author.id;
      const collector = msg.createReactionCollector(filter, { time: 60000 });

      collector.on('collect', reaction => {
        // Stop
        if (reaction.emoji.name === emojis[2]) {
          return collector.stop();

          // Backward
        } else if (reaction.emoji.name === emojis[1]) {
          if (page === 1) return message.reply('You cannot go before page 1!').then(m => m.delete({ timeout: 5000 }).catch(() => { }));
          page--;
          return msg.edit(embed.setDescription(pages[page - 1]).setFooter(`Page ${page} of ${pages.length} | Requested by ${message.author.tag}`, message.author.displayAvatarURL()));

          // Forward
        } else if (reaction.emoji.name === emojis[3]) {
          if (page === pages.length) return message.reply(`You cannot go after page ${page}!`).then(m => m.delete({ timeout: 5000 }).catch(() => { }));
          page++;
          return msg.edit(embed.setDescription(pages[page - 1]).setFooter(`Page ${page} of ${pages.length} | Requested by ${message.author.tag}`, message.author.displayAvatarURL()));

          // Rewind
        } else if (reaction.emoji.name === emojis[0]) {
          if (page === 1) return message.reply('You cannot go before page 1!').then(m => m.delete({ timeout: 5000 }).catch(() => { }));
          page = 1;
          return msg.edit(embed.setDescription(pages[0]).setFooter(`Page ${page} of ${pages.length} | Requested by ${message.author.tag}`, message.author.displayAvatarURL()));

          // Very end
        } else if (reaction.emoji.name === emojis[4]) {
          if (page === pages.length) return message.reply(`You cannot go after page ${page}!`).then(m => m.delete({ timeout: 5000 }).catch(() => { }));
          page = pages.length;
          return msg.edit(embed.setDescription(pages[page - 1]).setFooter(`Page ${page} of ${pages.length} | Requested by ${message.author.tag}`, message.author.displayAvatarURL()));
        }
      });

      collector.on('end', () => {
        if (!msg.deleted && Client.checkClientPerms(message.channel, 'MANAGE_MESSAGES')) msg.reactions.removeAll();
      });
    }
  } else {
    if (!await Client.checkPerms('rules', 'misc', message.member)) return Client.functions.get('noCustomPerm')(message, 'misc.rules');
    const choice = args[1].toLowerCase();
    if (choice === 'add') {
      if (!args[2]) return Client.functions.get('argMissing')(message.channel, 2, 'a rule to add');
      const rule = args.slice(2).join(' ');
      if (rule.length > 1000) return Client.functions.get('argFix')(Client, message.channel, 2, 'The rule\'s character length should not exceed 1,000.');
      if (rule.includes('\n')) return Client.functions.get('argFix')(Client, message.channel, 2, 'The rule may not include line breaks.');
      const curRules = (await Client.sql.query('SELECT rule FROM rules WHERE guildid = $1', [message.guild.id])).rows.map(r => r.rule);
      if (curRules.includes(rule)) return Client.functions.get('argFix')(Client, message.channel, 2, 'That rule is already on the list.');
      Client.sql.query('INSERT INTO rules (guildid, rule) VALUES ($1, $2)', [message.guild.id, rule]);
      return message.channel.send('Successfully added a rule.');
    } else if (choice === 'remove') {
      if (!args[2]) return Client.functions.get('argMissing')(message.channel, 2, 'a rule to remove');
      const rule = args.slice(2).join(' ');
      const curRules = (await Client.sql.query('SELECT rule FROM rules WHERE guildid = $1', [message.guild.id])).rows.map(r => r.rule);
      if (!curRules.includes(rule)) return Client.functions.get('argFix')(Client, message.channel, 2, 'The rule is not on the list.');
      Client.sql.query('DELETE FROM rules WHERE guildid = $1 AND rule = $2', [message.guild.id, rule]);
      return message.channel.send('Successfully removed a rule.');
    } else if (choice === 'clear') {
      const ruleExists = (await Client.sql.query('SELECT rule FROM rules WHERE guildid = $1 LIMIT 1', [message.guild.id])).rows[0];
      if (!ruleExists) return message.reply('There are no rules for me to clear!');
      Client.sql.query('DELETE FROM rules WHERE guildid = $1', [message.guild.id]);
      return message.channel.send('Successfully cleared the rules.');
    } else return Client.functions.get('argFix')(Client, message.channel, 1, 'The action you provided was invalid. The available actions are: add, remove, and clear.');
  }
};

module.exports.help = {
  name: 'rules',
  desc: 'Displays, adds, removes, or clears rules.',
  category: 'misc',
  usage: '?rules [<add, remove, or clear> <Value>]',
  aliases: []
};
