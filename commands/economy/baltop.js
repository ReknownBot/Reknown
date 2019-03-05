module.exports = async (Client, message, args) => {
  if (!Client.checkClientPerms(message.channel, 'EMBED_LINKS')) return Client.functions.get('noClientPerms')(message, ['Embed Links'], message.channel);

  const { rows } = await Client.sql.query('SELECT * FROM economy ORDER BY money DESC LIMIT 10');
  const desc = await Promise.all(rows.map(async (r, i) => {
    const user = await Client.bot.users.fetch(r.userid);
    const emoji = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : '🎀';
    return `${emoji} ${Client.escMD(user.tag)} - $${r.money}`;
  }));

  const embed = new Client.Discord.MessageEmbed()
    .setTitle('Economy Leaderboard')
    .setColor(0x00FF00)
    .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL())
    .setDescription(desc);

  return message.channel.send(embed);
};

module.exports.help = {
  name: 'baltop',
  desc: 'Displays the top 10 people with the highest economy balance.',
  category: 'economy',
  usage: '?baltop',
  aliases: ['ballb', 'balleaderboard', 'ecolb', 'ecoleaderboard']
};
