module.exports = async (Client, message, args) => {
  if (!await Client.checkPerms('cdelete', 'mod', message.member)) return message.reply(':x: Sorry, but you do not have the `mod.cdelete` permission.');

  if (!args[1]) return message.reply('You have to provide a channel for me to delete!');
  const channel = message.guild.channels.get(args[1].replace(/[<>#]/g, ''));
  if (!channel) return message.reply('That channel is invalid!');
  if (!channel.manageable) return message.reply('I do not have enough permissions to delete that channel!');

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
