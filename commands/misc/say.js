module.exports = async (Client, message, args) => {
  if (!args[1]) return message.reply('You have to include a message for me to say!');

  const embed = new Client.Discord.MessageEmbed()
    .setAuthor(message.author.tag, message.author.displayAvatarURL())
    .setColor(0x00FFFF)
    .setDescription(args.slice(1).join(' '));

  if (Client.checkClientPerms(message.channel, 'MANAGE_MESSAGES')) message.delete();
  return message.channel.send(embed);
};

module.exports.help = {
  name: 'say',
  desc: 'Says whatever you want in an embed!',
  category: 'misc',
  usage: '?say <Message>',
  aliases: []
};
