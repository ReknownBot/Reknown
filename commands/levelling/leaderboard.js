module.exports.run = async (client, message, args) => {
  if (!message.channel.permissionsFor(client.user).has('EMBED_LINKS')) return client.functions.noClientPerms(message, [ 'Embed Links' ], message.channel);

  const { rows } = await client.query('SELECT * FROM scores WHERE guildid = $1 ORDER BY points DESC', [ message.guild.id ]);
  if (rows.length === 0) return message.reply(':x: There was no levelling data found for this server.');

  const users = rows.map(async (r, i) => {
    const user = await client.users.fetch(r.userid);
    let place;
    if (i === 0) place = ':first_place:';
    else if (i === 1) place = ':second_place:';
    else if (i === 2) place = ':third_place:';
    else place = ':ribbon:';
    return `${place} ${client.escMD(user.tag)} | Level: **${r.level}** | XP: **${r.points}**`;
  });
  const desc = (await Promise.all(users)).join('\n');

  const embed = new client.MessageEmbed()
    .setColor(client.config.embedColor)
    .setDescription(desc)
    .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL())
    .setTimestamp()
    .setTitle(`Levelling Leaderboard for ${message.guild.name}`);

  return message.channel.send(embed);
};

module.exports.help = {
  aliases: [ 'toplevel' ],
  category: 'Levelling',
  desc: 'Shows the levelling leaderboard for the current server.',
  usage: 'leaderboard'
};
