module.exports = async (Client, message, args) => {
  if (!await Client.checkPerms('set', 'slowmode', message.member)) return message.reply(':x: Sorry, but you do not have the `slowmode.set` permission.');

  if (!args[1]) return message.reply('You have to provide a slowmode amount for me to set!');
  const slowmode = args[1];
  if (isNaN(slowmode)) return message.reply('The slowmode amount you provided was not a number!');
  if (slowmode > 120) return message.reply('The slowmode value has to be less or equal to 120!');
  if (slowmode < 0) return message.reply('The slowmode value cannot be lower than 0!');
  if (slowmode.includes('.')) return message.reply('THe slowmode value cannot be a decimal!');

  const channel = args[2] ? message.guild.channels.find(c => c.id === args[2].replace(/[<>#]/g, '') && c.type === 'text') : message.channel;
  if (!channel) return message.reply('I did not find a text channel from the channel you provided!');
  if (!Client.checkClientPerms(channel, 'MANAGE_CHANNELS')) return message.reply('I need the permission "Manage Channels" for this command!');

  channel.setRateLimitPerUser(slowmode);
  return message.channel.send(`Successfully set the slowmode to ${slowmode} in ${channel}.`);
};

module.exports.help = {
  name: 'slowmode',
  desc: 'Sets a slowmode for a channel.',
  category: 'moderation',
  usage: '?slowmode <Slowmode in Seconds> [Channel]',
  aliases: ['setslowmode']
};
