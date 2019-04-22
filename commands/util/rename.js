/**
 * @param {import('../../structures/client.js')} Client
 * @param {import('discord.js').Message} message
 * @param {String[]} args
*/
module.exports = async (Client, message, args) => {
  if (!args[1]) return Client.functions.get('argMissing')(message.channel, 1, 'a channel to rename');
  const channel = Client.getObj(args[1], { guild: message.guild, type: 'channel' });
  if (!channel) return Client.functions.get('argFix')(Client, message.channel, 1, 'Did not find a channel with that query.');
  if (!channel.permissionsFor(message.member).has('MANAGE_CHANNELS')) return Client.functions.get('argFix')(Client, message.channel, 1, 'You do not have enough permissions to delete that channel.');
  if (!Client.checkClientPerms(channel, 'MANAGE_CHANNELS')) return Client.functions.get('noClientPerms')(message, ['Manage Channel'], channel);

  if (!args[2]) return Client.functions.get('argMissing')(message.channel, 2, 'a name to rename the channel with');
  const name = args.slice(2).join(' ');
  if (name.length > 100) return Client.functions.get('argFix')(Client, message.channel, 2, 'The new name may not exceed 100 characters.');
  if (name.includes(' ') && channel.type === 'text') return Client.functions.get('argFix')(Client, message.channel, 2, 'The name may not include spaces if the channel type is text.');
  if (name === channel.name) return Client.functions.get('argFix')(Client, message.channel, 2, 'The channel name is already set to that value.');

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
