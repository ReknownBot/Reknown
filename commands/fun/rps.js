/**
 * @param {import('../../structures/client.js')} Client
 * @param {import('discord.js').Message} message
 * @param {String[]} args
 */
module.exports = async (Client, message, args) => {
  if (!args[1]) return Client.functions.get('argMissing')(message.channel, 1, 'a choice to play with');
  const choices = {
    r: 'rock',
    p: 'paper',
    s: 'scissors'
  };
  const choice = args[1].toLowerCase();
  if (!Object.values(choices).includes(choice) && !Object.keys(choices).includes(choice)) return Client.functions.get('argFix')(Client, message.channel, 1, 'Not a valid choice. Must be rock (r), paper (p), or scissors (s).');
  return message.channel.send(`I choose **${Object.values(choices)[Object.values(choices).length - 1]}**!`);
};

module.exports.help = {
  name: 'rps',
  desc: 'The bot rock paper scissors with you!',
  category: 'fun',
  usage: '?rps <Choice>',
  aliases: ['rockpaperscissors']
};
