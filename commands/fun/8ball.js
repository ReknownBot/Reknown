/**
 * @param {import('../../structures/client.js')} Client
 * @param {import('discord.js').Message} message
 * @param {String[]} args
 */
module.exports = async (Client, message, args) => {
  if (!args[1]) return Client.functions.get('argMissing')(message.channel, 1, 'a yes/no question');
  const reply = Client.functions.get('get8ball')();
  return message.channel.send(reply);
};

module.exports.help = {
  name: '8ball',
  desc: 'Sends a random 8ball reply.',
  category: 'fun',
  usage: '?8ball <Question>',
  aliases: []
};
