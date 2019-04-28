const isAFK = new Set();

/**
 * @param {import('../../structures/client.js')} Client
 * @param {import('discord.js').Message} message
 * @param {String[]} args
 */
module.exports = async (Client, message, args) => {
  if (isAFK.has(message.author.id + message.guild.id)) return message.reply('You are already AFK!');

  let reason;
  if (!args[1]) reason = 'None';
  else reason = args.slice(1).join(' ');

  isAFK.add(message.author.id + message.guild.id);
  message.channel.send(`You are now AFK for the reason of \`${Client.escMD(reason)}\``);

  const filter = m => (m.mentions.users.has(message.author.id) || m.author.id === message.author.id) && !m.author.bot;
  const collector = message.channel.createMessageCollector(filter);

  collector.on('collect', msg => {
    if (msg.author.id === message.author.id) {
      collector.stop();
      isAFK.delete(message.author.id + message.guild.id);
      return message.channel.send(`${message.author.tag}, Welcome back!`);
    } else {
      return message.reply(`${message.member} is currently AFK for \`${Client.escMD(reason)}\`.`);
    }
  });
};

module.exports.help = {
  name: 'afk',
  desc: 'Displays that you are AFK.',
  category: 'misc',
  usage: '?afk [Reason]',
  aliases: []
};
