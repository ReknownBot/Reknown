/**
 * @param {import('../../structures/client.js')} Client
 * @param {import('discord.js').Message} message
 * @param {String[]} args
*/
module.exports = async (Client, message, args) => {
  if (!Client.checkClientPerms(message.channel, 'EMBED_LINKS')) return Client.functions.get('noClientPerms')(message, ['Embed Links'], message.channel);
  if (!args[1]) return Client.functions.get('argMissing')(message.channel, 1, 'a message for me to say');
  const msg = args.slice(1).join(' ');

  const embed = new Client.Discord.MessageEmbed()
    .setAuthor(message.author.tag, message.author.displayAvatarURL())
    .setColor(0x00FFFF)
    .setDescription(msg);

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
