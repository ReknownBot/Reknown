module.exports = async (Client, message, args) => {
  if (!Client.checkClientPerms(message.channel, 'EMBED_LINKS')) return message.reply('I do not have the "Embed Links" permission! Make sure I have that for this command.');

  return Client.request('https://aws.random.cat/meow', (err, res, body) => {
    if (err) throw new Error(err);

    body = JSON.parse(body);
    const embed = new Client.Discord.MessageEmbed()
      .setTitle('Kitty!')
      .setColor(0x00FFFF)
      .setImage(body.file)
      .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL());
    return message.channel.send(embed);
  });
};

module.exports.help = {
  name: 'cat',
  desc: 'Outputs a random cat!',
  category: 'fun',
  usage: '?cat',
  aliases: ['kitty']
};
