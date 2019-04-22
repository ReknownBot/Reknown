/**
 * @param {import('../../structures/client.js')} Client
 * @param {import('discord.js').Message} message
 * @param {String[]} args
*/
module.exports = async (Client, message, args) => {
  if (!await Client.checkPerms('set', 'slowmode', message.member)) return Client.functions.get('noCustomPerm')(message, 'slowmode.set');

  if (!args[1]) return Client.functions.get('argMissing')(message.channel, 1, 'amount of slowmode');
  const slowmode = args[1];
  if (isNaN(slowmode)) return Client.functions.get('argFix')(Client, message.channel, 1, 'The amount of slowmode must be a number.');
  if (slowmode > 120) return Client.functions.get('argFix')(Client, message.channel, 1, 'The amount of slowmode may not exceed 120.');
  if (slowmode < 0) return Client.functions.get('argFix')(Client, message.channel, 1, 'The amount of slowmode may not below 0.');
  if (slowmode.includes('.')) return Client.functions.get('argFix')(Client, message.channel, 1, 'The amount of slowmode may not include a decimal.');

  const channel = args[2] ? Client.getObj(args[2], { guild: message.guild, type: 'channel' }) : message.channel;
  if (!channel || channel.type !== 'text') return Client.functions.get('argFix')(Client, message.channel, 2, 'I did not find a text channel with that query.');
  if (!Client.checkClientPerms(channel, 'MANAGE_CHANNELS')) return Client.functions.get('noClientPerms')(message, ['Manage Channels'], channel);

  channel.setRateLimitPerUser(slowmode);
  return message.channel.send(`Successfully set the slowmode to **${slowmode}** in ${channel}.`);
};

module.exports.help = {
  name: 'slowmode',
  desc: 'Sets a slowmode for a channel.',
  category: 'moderation',
  usage: '?slowmode <Slowmode in Seconds> [Channel]',
  aliases: ['setslowmode']
};
