module.exports = async (Client, message, args) => {
  const toggled = (await Client.sql.query('SELECT bool FROM togglelevel WHERE guildid = $1', [message.guild.id])).rows[0];
  if (!toggled || !toggled.bool) return message.reply('The leveling system is disabled! Use `?config togglelevel true` to turn it back on.');

  let member;
  if (!args[1]) member = message.member;
  else member = message.guild.members.get(args[1].replace(/[<>@!?]/g, ''));
  if (!member) return message.reply('The member you provided was invalid!');

  const level = (await Client.sql.query('SELECT points, level FROM scores WHERE userid = $1 AND guildid = $2 LIMIT 1', [member.id, message.guild.id])).rows[0];
  if (!level) return message.reply('That user has not been recorded in the database yet!');
  const { rows: all } = await Client.sql.query('SELECT points, level, userid FROM scores WHERE guildid = $1 ORDER BY points DESC', [message.guild.id]);
  const rank = all.indexOf(all.find(r => r.userid === member.id)) + 1;

  const embed = new Client.Discord.MessageEmbed()
    .setTitle(`${member.user.tag}'s Level Info`)
    .setColor(member.displayHexColor)
    .addField('Level', level.level, true)
    .addField('Points', `${level.points}/${Math.pow((level.level + 1) / 0.2, 2)}`, true)
    .addField('Rank', `#${rank}`)
    .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL());

  return message.channel.send(embed);
};

module.exports.help = {
  name: 'level',
  desc: 'Displays the level of a user.',
  category: 'fun',
  usage: '?level [Member]',
  aliases: ['lvl', 'rank']
};
