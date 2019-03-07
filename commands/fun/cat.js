/**
 * @param {import('../../structures/client.js')} Client
 * @param {import('discord.js').Message} message
 * @param {String[]} args
 */
module.exports = async (Client, message, args) => {
  if (!Client.checkClientPerms(message.channel, 'EMBED_LINKS')) return Client.functions.get('noClientPerms')(message, ['Embed Links'], message.channel);

  const body = await Client.fetch('https://aws.random.cat/meow').then(res => res.json());

  const embed = new Client.Discord.MessageEmbed()
    .setTitle('Kitty!')
    .setColor(0x00FFFF)
    .setImage(body.file)
    .setFooter(`Requested by ${message.author.tag} | Powered by https://aws.random.cat/`, message.author.displayAvatarURL());
  return message.channel.send(embed);
};

module.exports.help = {
  name: 'cat',
  desc: 'Outputs a random cat!',
  category: 'fun',
  usage: '?cat',
  aliases: ['kitty']
};
