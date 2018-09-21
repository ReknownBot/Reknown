module.exports = async (Client, message, args) => {
  if (!args[1]) var member = message.member;
  // eslint-disable-next-line no-redeclare
  else var member = message.guild.members.get(args[1].replace(/[<>@!?]/g, ''));
  if (!member) return message.reply('That member does not exist!');

  const embed = new Client.Discord.MessageEmbed()
    .setTitle(`${member.user.tag}'s Avatar`)
    .setImage(member.user.displayAvatarURL({ size: 2048 }))
    .setColor(member.displayHexColor);

  return message.channel.send(embed);
};

module.exports.help = {
  name: 'avatar',
  desc: 'Displays your or someone else\'s profile picture.',
  category: 'util',
  usage: '?avatar [Member]',
  aliases: ['av', 'pfp', 'profilepic']
};
