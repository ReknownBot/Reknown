/**
 * @param {import('../../structures/client.js')} Client
 * @param {import('discord.js').Message} message
 * @param {String[]} args
*/
module.exports = async (Client, message, args) => {
  if (!await Client.checkPerms('cdelete', 'mod', message.member)) return Client.functions.get('noCustomPerm')(message, 'mod.cdelete');

  if (!args[1]) return Client.functions.get('argMissing')(message.channel, 1, 'a channel to delete');
  const channel = Client.getObj(args[1], { guild: message.guild, type: 'channel' });
  if (!channel) return Client.functions.get('argFix')(Client, message.channel, 1, 'Did not find a channel with that query.');
  if (!channel.manageable) return Client.functions.get('argFix')(Client, message.channel, 1, 'I am missing permissions to be able to delete that channel.');

  channel.delete('?deletechannel Command');
  return message.channel.send(`Successfully deleted \`${channel.name}\`.`);
};

module.exports.help = {
  name: 'deletechannel',
  desc: 'Deletes a mentioned channel.',
  category: 'util',
  usage: '?deletechannel <Channel>',
  aliases: ['dchannel', 'deletechan']
};
