/**
 * @param {import('../../structures/client.js')} Client
 * @param {import('discord.js').Message} message
 * @param {String[]} args
 */
module.exports = async (Client, message, args) => {
  if (!Client.checkClientPerms(message.channel, 'EMBED_LINKS')) return Client.functions.get('noClientPerms')(message, ['Embed Links'], message.channel);

  const toggled = (await Client.sql.query('SELECT bool FROM togglelevel WHERE guildid = $1 AND bool = $2', [message.guild.id, 1])).rows[0];
  if (!toggled) return message.reply('The leveling system is disabled!');

  const { rows: levels } = await Client.sql.query('SELECT points,userid,level FROM scores WHERE guildid = $1 ORDER BY points DESC LIMIT 10', [message.guild.id]);

  const members = levels.map(r => message.guild.members.get(r.userid)).filter(m => m);
  const lb = levels.filter(r => message.guild.members.has(r.userid)).map((r, i) => `${i ? i === 1 ? ':second_place:' : i === 2 ? ':third_place:' : ':ribbon:' : ':first_place:'} ${members[i].user.tag} - **${Client.formatNum(r.level)}** Levels | **${Client.formatNum(r.points)}** Points`);

  const embed = new Client.Discord.MessageEmbed()
    .setTitle(`Leveling Leaderboard for ${message.guild.name}`)
    .setDescription(lb.join('\n'))
    .setColor(0x00FF00)
    .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL());

  return message.channel.send(embed);
};

module.exports.help = {
  name: 'leaderboard',
  desc: 'Shows the leaderboard for levels on the server.',
  category: 'fun',
  usage: '?leaderboard',
  aliases: ['lb', 'leaderboards']
};
