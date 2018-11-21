module.exports = async (Client, message, args) => {
  if (!args[1]) return message.reply('You have to put a choice!');
  const choices = {
    r: 'rock',
    p: 'paper',
    s: 'scissors'
  };
  const choice = args[1].toLowerCase();
  if (!Object.values(choices).includes(choice) && !Object.keys(choices).includes(choice)) return message.reply('That is not a valid choice!');
  return message.channel.send(`I choose **${Object.values(choices)[Object.values(choices).length - 1]}**!`);
};

module.exports.help = {
  name: 'rps',
  desc: 'The bot rock paper scissors with you!',
  category: 'fun',
  usage: '?rps <Choice>',
  aliases: ['rockpaperscissors']
};
