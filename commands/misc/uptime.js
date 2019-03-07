/**
 * @param {import('../../structures/client.js')} Client
 * @param {import('discord.js').Message} message
 * @param {String[]} args
*/
module.exports = async (Client, message, args) => {
  const seconds = Math.floor((Client.bot.uptime / 1000) % 60);
  const minutes = Math.floor((Client.bot.uptime / 1000 / 60) % 60);
  const hours = Math.floor((Client.bot.uptime / 1000 / 60 / 60) % 24);
  const days = Math.floor(Client.bot.uptime / 1000 / 60 / 60 / 24);

  return message.channel.send(`**Uptime**: **${days}** Days, **${hours}** Hours, **${minutes}** Minutes, and **${seconds}** Seconds.`);
};

module.exports.help = {
  name: 'uptime',
  desc: 'Displays the current uptime of the bot.',
  category: 'misc',
  usage: '?uptime',
  aliases: []
};
