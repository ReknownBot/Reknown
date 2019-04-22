/**
 * @param {import('../structures/client.js')} Client
 * @param {import('discord.js').TextChannel} channel
 * @param {Number} num
 * @param {String} reason
 */
module.exports = async (Client, channel, num, reason) => {
  if (Client.checkClientPerms(channel, 'EMBED_LINKS')) {
    const embed = new Client.Discord.MessageEmbed()
      .setTitle(`Argument #${num} Incorrect`)
      .setDescription(`The argument was incorrect because of the following reason.\n\n${reason}`)
      .setColor(0xFF0000);
    return channel.send(embed);
  }

  return channel.send(`The argument #${num} was incorrect for the following reason.\n\n${reason}`);
};
