module.exports = async (Client, message, args) => {
  if (!args[1]) return message.reply('You have to provide an equation for me to solve!');
  const eq = args.slice(1).join(' ');
  try {
    var result = require('string-math')(eq);
  } catch (e) {
    return message.reply('The formula you have put in was incorrect!');
  }

  return message.channel.send(`The result from **${Client.escapeMarkdown(eq)}** was **${Client.escapeMarkdown(result.toString())}**!`);
};

module.exports.help = {
  name: 'calculate',
  desc: 'Calculates a math equation. Powered by **[string-math](https://www.npmjs.com/package/string-math)**.',
  category: 'misc',
  usage: '?calculate <Equation>',
  aliases: ['calc']
};
