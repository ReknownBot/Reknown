/**
 * @param {import('../../structures/client.js')} Client
 * @param {import('discord.js').Message} message
 * @param {String[]} args
*/
module.exports = async (Client, message, args) => {
  if (!args[1]) return message.reply('You have to provide a channel for me to rename!');
  const channel = Client.getObj(args[1], { guild: message.guild, type: 'channel' });
  if (!channel) return message.reply('The channel you provided was invalid!');
  if (!channel.permissionsFor(message.member).has('MANAGE_CHANNELS')) return message.reply('You do not have enough permissions on that channel!');
  if (!channel.permissionsFor(message.guild.me).has('MANAGE_CHANNELS')) return message.reply('I do not have enough permissions to rename that channel!');

  if (!args[2]) return message.reply('You have to provide a new channel name!');
  const name = args.slice(2).join(' ');
  if (name.length > 100) return message.reply('The new name may not exceed 100 characters!');
  if (name.includes(' ')) return message.reply('Text channel names may not include spaces!');
  if (name === channel.name) return message.reply('That channel\'s name is already set to that value!');

  channel.setName(name);
  return message.channel.send(`Successfully renamed that channel to ${name}.`);
};

module.exports.help = {
  name: 'rename',
  desc: 'Renames a mentioned channel to something else.',
  category: 'util',
  usage: '?rename <Text Channel> <New Name>',
  aliases: []
};
