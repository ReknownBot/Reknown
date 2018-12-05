module.exports = async (Client, message, args) => {
  if (!args[1]) return message.reply('You have to provide an equation for me to solve!');
  const eq = args.slice(1).join(' ');
  let result;
  try {
    result = require('string-math')(eq);
  } catch (e) {
    return message.reply('The formula you put in was incorrect!');
  }

  return message.channel.send(`The result from **${Client.escMD(eq)}** was **${Client.escMD(result.toString())}**!`);
};

module.exports.help = {
  name: 'calculate',
  desc: 'Calculates a math equation. Powered by **[string-math](https://www.npmjs.com/package/string-math)**.',
  category: 'util',
  usage: '?calculate <Equation>',
  aliases: ['calc']
};
