/**
 * @param {import('../../structures/client.js')} Client
 * @param {import('discord.js').Message} message
 * @param {String[]} args
*/
module.exports = async (Client, message, args) => {
  if (!args[1]) return Client.functions.get('argMissing')(message.channel, 1, 'an equation to solve');
  const eq = args.slice(1).join(' ');
  let result;
  try {
    result = require('string-math')(eq);
  } catch (e) {
    return Client.functions.get('argFix')(Client, message.channel, 1, 'Something was wrong with the equation.');
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
