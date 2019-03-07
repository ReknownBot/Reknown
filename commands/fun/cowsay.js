/**
 * @param {import('../../structures/client.js')} Client
 * @param {import('discord.js').Message} message
 * @param {String[]} args
 */

const cowsay = require('cowsay');

module.exports = async (Client, message, args) => {
  if (!args[1]) return message.reply('You have to provide a message for me to say as a cow!');
  const msg = args.slice(1).join(' ');
  const cmsg = cowsay.say({
    text: msg
  });
  if (cmsg.length + 6 > 2048) return message.reply('The total message length I have to send is over 2048, try lowering the content length!');

  return message.channel.send(`\`\`\`${cmsg}\`\`\``);
};

module.exports.help = {
  name: 'cowsay',
  desc: 'Shows a cow saying whatever you tell it to!',
  category: 'fun',
  usage: '?cowsay <Message>',
  aliases: ['csay']
};
