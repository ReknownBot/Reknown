module.exports = async (Client, message, args) => {
  if (!Client.checkClientPerms(message.channel, 'EMBED_LINKS')) return message.reply('I do not have the required permission `Embed Links` in this channel.');

  const registered = (await Client.sql.query('SELECT money FROM economy WHERE userid = $1', [message.author.id])).rows[0];
  if (!registered) return message.reply(`You are not registered! Use \`${Client.escMD(Client.prefixes[message.guild.id])}register\` to do so.`);

  const cooldown = (await Client.sql.query('SELECT time FROM work WHERE userid = $1', [message.author.id])).rows[0];
  if (cooldown && Date.now() - cooldown.time < 21600000) return message.reply(`This command is still in cooldown! Please wait ${Math.floor((21600000 - (Date.now() - cooldown.time)) / 1000)} more seconds.`);

  if (cooldown) Client.sql.query('DELETE FROM work WHERE userid = $1', [message.author.id]);

  const amt = Math.floor(Math.random() * 101) + 100;

  Client.sql.query('UPDATE economy SET money = money + $1 WHERE userid = $2', [amt, message.author.id]);
  Client.sql.query('INSERT INTO work (time, userid) VALUES ($1, $2)', [Date.now(), message.author.id]);

  const embed = new Client.Discord.MessageEmbed()
    .setTitle('You finished working!')
    .setColor(0x00FF00)
    .setDescription(`You earned **${amt}** Credits.`)
    .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL())
    .setTimestamp();

  return message.channel.send(embed);
};

module.exports.help = {
  name: 'work',
  desc: 'Gets you credits by working. The cooldown is 6 hours.',
  category: 'economy',
  usage: '?work',
  aliases: []
};
