module.exports = async (Client, message, args) => {
  if (!await Client.checkPerms('ban', 'mod', message.member)) return message.reply(':x: Sorry, but you do not have the `mod.ban` permission.');
  if (!Client.checkClientPerms(message.channel, 'BAN_MEMBERS')) return message.reply('I do not have enough permissions!');

  const bans = await message.guild.fetchBans();
  if (bans.size === 0) return message.reply('There are no bans in this server!');

  const pages = [];
  let page = 1;
  let str = '';
  bans.forEach(ban => {
    if (ban.user.tag.length + ban.user.id.length + 5 > 2048) {
      pages.push(str);
      str = '';
    }
    str += `${ban.user.tag} || ${ban.user.id}\n`;
  });
  if (str) pages.push(str);

  if (pages.length === 1) {
    const embed = new Client.Discord.MessageEmbed()
      .setTitle(`Bans in ${message.guild.name}`)
      .setColor(0x00FFFF)
      .setDescription(pages[0])
      .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL());
    return message.channel.send(embed);
  }

  const embed = new Client.Discord.MessageEmbed()
    .setTitle(`Bans in ${message.guild.name}`)
    .setColor(0x00FFFF)
    .setDescription(pages[0])
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
      return msg.edit(embed.setDescription(pages[page - 1]).setFooter(`Page ${page} of ${pages.length} | Requested by ${message.author.tag}`, message.author.displayAvatarURL()));

      // Forward
    } else if (reaction.emoji.name === emojis[0]) {
      if (page === pages.length) return message.reply(`You cannot go after page ${page}!`).then(m => m.delete({ timeout: 5000 }).catch(() => { }));
      page++;
      return msg.edit(embed.setDescription(pages[page - 1]).setFooter(`Page ${page} of ${pages.length} | Requested by ${message.author.tag}`, message.author.displayAvatarURL()));

      // Rewind
    } else if (reaction.emoji.name === emojis[4]) {
      if (page === 1) return message.reply('You cannot go before page 1!').then(m => m.delete({ timeout: 5000 }).catch(() => { }));
      page = 1;
      return msg.edit(embed.setDescription(pages[0]).setFooter(`Page ${page} of ${pages.length} | Requested by ${message.author.tag}`, message.author.displayAvatarURL()));

      // Very end
    } else if (reaction.emoji.name === emojis[3]) {
      if (page === pages.length) return message.reply(`You cannot go after page ${page}!`).then(m => m.delete({ timeout: 5000 }).catch(() => { }));
      page = pages.length;
      return msg.edit(embed.setDescription(pages[page - 1]).setFooter(`Page ${page} of ${pages.length} | Requested by ${message.author.tag}`, message.author.displayAvatarURL()));
    }
  });

  collector.on('end', () => {
    if (!forced && !msg.deleted) msg.reactions.filter(r => r.users.has(Client.bot.user.id)).forEach(r => r.users.remove(Client.bot.user));
  });
};

module.exports.help = {
  name: 'bans',
  desc: 'Displays all the bans on the server.',
  category: 'moderation',
  usage: '?bans',
  aliases: ['listbans']
};
