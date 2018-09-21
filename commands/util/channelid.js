module.exports = async (Client, message, args) => {
  const channel = args[1] ? message.guild.channels.get(args[1].replace(/[<>#]/g, '')) : message.channel;
  if (!channel) return message.reply('That channel is invalid!');
  return message.channel.send(`The channel ID for ${channel} is \`${channel.id}\`.`);
};

module.exports.help = {
  name: 'channelid',
  desc: 'Displays the ID of a channel.',
  category: 'util',
  usage: '?channelid [Channel]',
  aliases: ['cid']
};
