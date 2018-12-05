module.exports = async (Client, message, args) => {
  if (!args[1]) {
    const rules = (await Client.sql.query('SELECT rule FROM rules WHERE guildid = $1', [message.guild.id])).rows.map((r, index) => `**${index + 1}.** ${r.rule}`);
    if (rules.length === 0) return message.reply('There are currently no rules on this server!');
    if (!Client.checkClientPerms(message.channel, 'EMBED_LINKS', 'ADD_REACTIONS')) return message.reply('I need the permissions "Embed Links" and "Add Reactions" for this command!');
    const arr = Client.Discord.Util.splitMessage(rules.join('\n'), { maxLength: 2048 });
    if (typeof arr === 'string') {
      const embed = new Client.Discord.MessageEmbed()
        .setTitle(`Rules in ${message.guild.name}`)
        .setColor(0x00FFFF)
        .setDescription(arr);

      return message.author.send(embed)
        .then(() => message.channel.send('Check your DMs!'))
        .catch(() => message.channel.send(embed));
    } else {
      const pages = arr;
      let page = 1;

      const embed = new Client.Discord.MessageEmbed()
        .setTitle(`Rules in ${message.guild.name}`)
        .setColor(0x00FFFF)
        .setFooter(`Page 1 of ${arr.length}`)
        .setDescription(arr[0]);

      let msg = await message.author.send(embed);
      if (!msg) msg = await message.channel.send(embed);
      else message.channel.send('Check your DMs!');
      await msg.react('◀');
      await msg.react('▶');

      const backwardFilter = (reaction, user) => reaction.emoji.name === '◀' && user.id === message.author.id;
      const forwardFilter = (reaction, user) => reaction.emoji.name === '▶' && user.id === message.author.id;

      const backwards = msg.createReactionCollector(backwardFilter, {
        time: 60000
      });
      const forwards = msg.createReactionCollector(forwardFilter, {
        time: 60000
      });

      backwards.on('collect', () => {
        if (page === 1) return msg.channel.name ? message.channel.send('You cannot go before page 1!').then(m => m.delete({ timeout: 5000 })) : message.author.send('You cannot go before page 1!').then(m => m.delete({ timeout: 5000 }));
        page--;
        embed.setDescription(pages[page - 1])
          .setFooter(`Page ${page} of ${pages.length}`);
        msg.edit(embed);
      });

      forwards.on('collect', () => {
        if (page === pages.length) return msg.channel.name ? message.channel.send(`You cannot go beyond page ${pages.length}!`).then(m => m.delete({ timeout: 5000 })) : message.author.send(`You cannot go beyond page ${pages.length}!`).then(m => m.delete({ timeout: 5000 }));
        page++;
        embed.setDescription(pages[page - 1])
          .setFooter(`Page ${page} of ${pages.length}`);
        msg.edit(embed);
      });

      backwards.on('end', () => {
        msg.reactions.forEach(r2 => {
          if (r2.users.has(Client.bot.user.id)) r2.users.remove(Client.bot.user.id);
        });
      });
    }
  } else {
    if (!await Client.checkPerms('rules', 'misc', message.member)) return message.reply(':x: Sorry, but you do not have the `misc.rules` permission. Looking for the rules itself? Use `?rules` by itself.');
    const choice = args[1].toLowerCase();
    if (choice === 'add') {
      if (!args[2]) return message.reply('You have to provide a rule for me to add!');
      const rule = args.slice(2).join(' ');
      if (rule.length > 1000) return message.reply('The rule may not exceed 1000 characters!');
      if (rule.includes('\n')) return message.reply('The rule may not include line breaks!');
      const curRules = (await Client.sql.query('SELECT rule FROM rules WHERE guildid = $1', [message.guild.id])).rows.map(r => r.rule);
      if (curRules.includes(rule)) return message.reply('That rule is already in the list!');
      Client.sql.query('INSERT INTO rules (guildid, rule) VALUES ($1, $2)', [message.guild.id, rule]);
      return message.channel.send('Successfully added a rule.');
    } else if (choice === 'remove') {
      if (!args[2]) return message.reply('You have to provide a rule for me to remove!');
      const rule = args.slice(2).join(' ');
      const curRules = (await Client.sql.query('SELECT rule FROM rules WHERE guildid = $1', [message.guild.id])).rows.map(r => r.rule);
      if (!curRules.includes(rule)) return message.reply('That rule is not in the list!');
      Client.sql.query('DELETE FROM rules WHERE guildid = $1 AND rule = $2', [message.guild.id, rule]);
      return message.channel.send('Successfully removed a rule.');
    } else if (choice === 'clear') {
      const ruleExists = (await Client.sql.query('SELECT rule FROM rules WHERE guildid = $1 LIMIT 1', [message.guild.id])).rows[0];
      if (!ruleExists) return message.reply('There are no rules for me to clear!');
      Client.sql.query('DELETE FROM rules WHERE guildid = $1', [message.guild.id]);
      return message.channel.send('Successfully cleared the rules.');
    } else return message.reply('None of the options matches your option. The options are `add`, `remove`, and `clear`.');
  }
};

module.exports.help = {
  name: 'rules',
  desc: 'Either displays the rules, or adds, removes, or clears rules.',
  category: 'misc',
  usage: '?rules [<add, remove, or clear> <Value>]',
  aliases: []
};
