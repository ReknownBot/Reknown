/**
 * @param {import('../../structures/client.js')} Client
 * @param {import('discord.js').Message} message
 * @param {String[]} args
*/
module.exports = async (Client, message, args) => {
  if (!Client.checkClientPerms(message.channel, 'EMBED_LINKS')) return Client.functions.get('noClientPerms')(message, ['Embed Links'], message.channel);

  /** @type {import('discord.js').User} */
  const user = args[1] ? await Client.getObj(args[1], { type: 'user' }) : message.author;
  if (!user) return Client.functions.get('argFix')(Client, message.channel, 1, 'Did not find a user with that query.');

  const isAnimated = user.displayAvatarURL().endsWith('.gif');
  const embed = new Client.Discord.MessageEmbed()
    .setTitle(`${message.author === user ? 'Your' : `${user.tag}'s`} Avatar`)
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
