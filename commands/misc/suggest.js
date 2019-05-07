const cooldowns = {};

/**
 * @param {import('../../structures/client.js')} Client
 * @param {import('discord.js').Message} message
 * @param {String[]} args
*/
module.exports = async (Client, message, args) => {
  if (!args[1]) return Client.functions.get('argMissing')(message.channel, 1, 'a suggestion');
  const suggestion = args.slice(1).join(' ');
  if (cooldowns[message.author.id]) return message.reply(`Please wait \`${Math.round((600000 - (Date.now() - cooldowns[message.author.id])) / 1000 * 100) / 100}\` more seconds before using this command again.`);

  cooldowns[message.author.id] = Date.now();
  setTimeout(() => delete cooldowns[message.author.id], 1000 * 60 * 10);

  const channel = message.client.channels.get('461229814406316052');
  const embed = new Client.Discord.MessageEmbed()
    .setAuthor(`New Suggestion by ${message.author.tag} - ${message.author.id}`, message.author.displayAvatarURL())
    .setColor(0x00FFFF)
    .setDescription(suggestion)
    .setTimestamp();

  channel.send(embed);
  return message.channel.send('✅ Successfully sent a suggestion. Please wait 10 minutes before suggesting again.');
};

module.exports.help = {
  name: 'suggest',
  desc: 'Suggests something related to the bot. Any abuse of this command will result in a global blacklist. This command has a 10-minute cooldown.',
  category: 'misc',
  usage: '?suggest <Suggestion>',
  aliases: []
};
