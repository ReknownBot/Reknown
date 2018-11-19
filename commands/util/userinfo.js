module.exports = async (Client, message, args) => {
  if (!args[1]) {
    var member = message.member;
  } else {
    // eslint-disable-next-line no-redeclare
    var member = message.guild.members.get(args[1].replace(/[<>@!?]/g, ''));
    return message.reply('That is not a valid member!');
  }

  let roles = member.roles.filter(role => role !== message.guild.defaultRole).map(role => role.toString()).list();
  if (roles.length > 1024) roles = 'Too many to display.';
  if (!roles) roles = 'None';

  const members = message.guild.members;
  const memSort = members.sort((a, b) => {
    return a.joinedTimestamp - b.joinedTimestamp;
  }).array();
  let position = 0;
  for (let i = 0; i < memSort.length; i++) {
    position++;
    if (memSort[i].id === member.id) break;
  }

  const embed = new Client.Discord.MessageEmbed()
    .setTitle(`${member.user.tag}'s User Info`)
    .setColor(member.displayHexColor)
    .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL())
    .setTimestamp()
    .setThumbnail(member.user.displayAvatarURL())
    .addField('Created At', Client.dateFormat(member.user.createdAt), true)
    .addField('Joined At', Client.dateFormat(member.joinedAt), true)
    .addField('Roles', roles)
    .addField('Status', Client.capFirstLetter(member.presence.status), true)
    .addField('Joined Position', position, true);

  if (member.presence.activity) embed.addField('Game', member.presence.activity.name);

  return message.channel.send(embed);
};

module.exports.help = {
  name: 'userinfo',
  desc: 'Displays user info about the user mentioned.',
  category: 'util',
  usage: '?userinfo [Member]',
  aliases: ['profile', 'uinfo', 'whois']
};
