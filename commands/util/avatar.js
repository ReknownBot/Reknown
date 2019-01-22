module.exports = async (Client, message, args) => {
  const user = args[1] ? await Client.getObj(args[1], { type: 'user' }) : message.author;
  if (!user) return message.reply('That user does not exist!');

  const isAnimated = user.displayAvatarURL().includes('gif');
  const embed = new Client.Discord.MessageEmbed()
    .setTitle(`${user.tag}'s Avatar`)
    .setImage(user.displayAvatarURL({ size: 2048, format: isAnimated ? 'gif' : 'png' }))
    .setColor(0x00FFFF);

  return message.channel.send(embed);
};

module.exports.help = {
  name: 'avatar',
  desc: 'Displays your or someone else\'s profile picture.',
  category: 'util',
  usage: '?avatar [Member]',
  aliases: ['av', 'pfp', 'profilepic']
};
