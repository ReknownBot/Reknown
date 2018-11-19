module.exports = async (Client, message, args) => {
  if (!Client.checkClientPerms(message.channel, 'EMBED_LINKS')) return message.reply('I do not have the "Embed Links" permission! Make sure I have that for this command.');
  const url = await require('random-puppy')();
  const embed = new Client.Discord.MessageEmbed()
    .setTitle('Doggo!')
    .setImage(url)
    .setColor(0x00FFFF)
    .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL());
  return message.channel.send(embed);
};

module.exports.help = {
  name: 'dog',
  desc: 'Outputs a random dog!',
  category: 'fun',
  usage: '?dog',
  aliases: ['puppy']
};
