module.exports = async (Client, message, args) => {
  let user;
  if (!args[1]) user = message.author;
  else user = await Client.bot.users.fetch(args[1].replace(/[<>@!?]/g, '')).catch(() => 'didn\'t find');
  if (!user || user === 'didn\'t find') return message.reply('That user does not exist!');

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
