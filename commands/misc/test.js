/**
 * @param {import('../../structures/client.js')} Client
 * @param {import('discord.js').Message} message
 * @param {String[]} args
*/
module.exports = (Client, message, args) => {
  return message.channel.send(`:wave:`);
};

module.exports.help = {
  name: 'test',
  desc: 'Does a thing!',
  category: 'misc',
  usage: '?test',
  aliases: ['test']
};
