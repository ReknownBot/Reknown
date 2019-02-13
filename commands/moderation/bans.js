module.exports = async (Client, message, args) => {
  if (!await Client.checkPerms('ban', 'mod', message.member)) return message.reply(':x: Sorry, but you do not have the `mod.ban` permission.');
  if (!Client.checkClientPerms(message.channel, 'BAN_MEMBERS')) return message.reply('I require the permission `Ban Members` for this command.');

  const bans = await message.guild.fetchBans();
  if (bans.size === 0) return message.reply('There are no bans in this server!');

  const pages = Client.splitMessage(bans.map(ban => `${Client.escMD(ban.user.tag)} \`${ban.user.id}\``).join('\n'), { maxLength: 2048 });

  if (typeof pages === 'string') {
    const embed = new Client.Discord.MessageEmbed()
      .setTitle(`Bans in ${message.guild.name}`)
      .setColor(0x00FFFF)
      .setDescription(pages)
      .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL());
    return message.channel.send(embed);
  }

  if (!Client.checkClientPerms(message.channel, 'ADD_REACTIONS', 'MANAGE_MESSAGES')) return message.reply('There are multiple pages of bans. I require the permissions `Add Reactions` and `Manage Messages` to do this.');
  let page = 1;

  const embed = new Client.Discord.MessageEmbed()
    .setTitle(`Bans in ${message.guild.name}`)
    .setColor(0x00FFFF)
    .setDescription(pages[0])
    .setFooter(`Page 1 of ${pages.length} | Requested by ${message.author.tag}`, message.author.displayAvatarURL());
  const msg = await message.channel.send(embed);
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
    if (!msg.deleted) msg.reactions.removeAll();
  });
};

module.exports.help = {
  name: 'bans',
  desc: 'Displays all the bans on the server.',
  category: 'moderation',
  usage: '?bans',
  aliases: ['listbans']
};
