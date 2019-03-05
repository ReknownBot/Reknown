module.exports = async (Client, message, args) => {
  if (!Client.checkClientPerms(message.channel, 'EMBED_LINKS')) return Client.functions.get('noClientPerms')(message, ['Embed Links'], message.channel);
  const body = await Client.fetch('https://dog.ceo/api/breeds/image/random').then(res => res.json());
  if (body.status !== 'success') return message.reply('It looks like the API is down, please try again later.');

  const embed = new Client.Discord.MessageEmbed()
    .setTitle('Doggo!')
    .setImage(body.message)
    .setColor(0x00FFFF)
    .setFooter(`Requested by ${message.author.tag} | Powered by https://dog.ceo/dog-api`, message.author.displayAvatarURL());
  return message.channel.send(embed);
};

module.exports.help = {
  name: 'dog',
  desc: 'Outputs a random dog!',
  category: 'fun',
  usage: '?dog',
  aliases: ['puppy']
};
