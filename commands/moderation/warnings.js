module.exports = async (Client, message, args) => {
  const member = args[1] ? message.guild.members.get(args[1].replace(/[@<>!?]/g, '')) : message.member;
  if (!member) return message.reply('That is not a valid member!');

  const { rows } = await Client.sql.query('SELECT * FROM warnings WHERE userid2 = $1 ORDER BY warnid DESC', [member.id + message.guild.id]);
  if (!rows[0]) return message.reply(`${message.member === member ? 'You do' : 'That user does'} not have any warnings!`);

  const warnings = rows.map(r => `${Client.escapeMarkdown(r.warnreason)} \`Warn ID: ${r.warnid}\``);
  if (warnings.join('\n').length <= 2048) {
    const embed = new Client.Discord.MessageEmbed()
      .setTitle(`${member.user.tag}'s Warning Info`)
      .setDescription(warnings.join('\n'))
      .addField('Total Warnings', rows[0].warnamount)
      .setColor(member.displayHexColor)
      .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL());
    return message.channel.send(embed);
  } else {
    const pages = [];
    let page = 1;
    let str = '';
    warnings.forEach(warn => {
      if (str.length + warn.length > 2048) {
        pages.push(str);
        str = '';
      }
      str += warn;
    });
    const embed = new Client.Discord.MessageEmbed()
      .setTitle(`${member.user.tag}'s Warning Info`)
      .setDescription(pages[0])
      .addField('Total Warnings', rows[0].warnamount)
      .setColor(member.displayHexColor)
      .setFooter(`Page 1 of ${pages.length} | Requested by ${message.author.tag}`, message.author.displayAvatarURL());

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

    collector.on('collect', r => {
      // Stop
      if (r.emoji.name === emojis[2]) {
        forced = true;
        collector.stop();
        return msg.reactions.filter(r => r.users.has(Client.bot.user.id)).forEach(r => r.users.remove(Client.bot.user));

      // Backward
      } else if (r.emoji.name === emojis[1]) {
        if (page === 1) return message.reply('You cannot go before page 1!').then(m => m.delete({ timeout: 5000 }).catch(() => {}));
        page--;
        return msg.edit(embed.setDescription(pages[page - 1]).setFooter(`Page ${page} of ${pages.length} | Requested by ${message.author.tag}`, message.author.displayAvatarURL()));

      // Forward
      } else if (r.emoji.name === emojis[0]) {
        if (page === pages.length) return message.reply(`You cannot go after page ${page}!`).then(m => m.delete({ timeout: 5000 }).catch(() => {}));
        page++;
        return msg.edit(embed.setDescription(pages[page - 1]).setFooter(`Page ${page} of ${pages.length} | Requested by ${message.author.tag}`, message.author.displayAvatarURL()));

      // Rewind
      } else if (r.emoji.name === emojis[4]) {
        if (page === 1) return message.reply('You cannot go before page 1!').then(m => m.delete({ timeout: 5000 }).catch(() => {}));
        page = 1;
        return msg.edit(embed.setDescription(pages[0]).setFooter(`Page ${page} of ${pages.length} | Requested by ${message.author.tag}`, message.author.displayAvatarURL()));

      // Very end
      } else if (r.emoji.name === emojis[3]) {
        if (page === pages.length) return message.reply(`You cannot go after page ${page}!`).then(m => m.delete({ timeout: 5000 }).catch(() => {}));
        page = pages.length;
        return msg.edit(embed.setDescription(pages[page - 1]).setFooter(`Page ${page} of ${pages.length} | Requested by ${message.author.tag}`, message.author.displayAvatarURL()));
      }
    });

    collector.on('end', () => {
      if (!forced && !msg.deleted) msg.reactions.filter(r => r.users.has(Client.bot.user.id)).forEach(r => r.users.remove(Client.bot.user));
    });
  }
};

module.exports.help = {
  name: 'warnings',
  desc: 'Displays the amount of warnings a user has.',
  category: 'moderation',
  usage: '?warnings [Member]',
  aliases: ['warns']
};
