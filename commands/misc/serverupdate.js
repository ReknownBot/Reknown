module.exports = async (Client, message, args) => {
  if (!await Client.checkPerms('update', 'misc', message.member)) return message.reply(':x: Sorry, but you do not have the `misc.update` permission.');

  if (!args[1]) return message.reply('You have to include a version of the server!');
  const version = args[1];

  if (!args[2]) return message.reply('You have to include an update message!');
  const updatemsg = args.slice(2).join(' ');

  const updateRow = (await Client.sql.query('SELECT channelid FROM updatechannel WHERE guildid = $1 LIMIT 1', [message.guild.id])).rows[0];
  if (!updateRow) return message.reply('The update channel is not set! Please do so using `config updatechannel <Channel>`.');

  const channel = message.guild.channels.get(updateRow.channelid);
  if (!channel) return message.reply('The channel ID that was set in the updatechannel config was invalid! Please recalibrate it by using `config updatechannel <Channel>`.');
  if (!Client.checkClientPerms(channel, 'VIEW_CHANNEL', 'SEND_MESSAGES', 'EMBED_LINKS')) return Client.functions.get('noClientPerms')(message, ['View Channels', 'Send Messages', 'Embed Links'], channel);

  const embed = new Client.Discord.MessageEmbed()
    .setDescription(updatemsg)
    .setFooter(`Version ${version} | Updated by ${message.author.tag}`)
    .setColor(0x00FFFF);

  channel.send(embed);
  return message.channel.send(`Successfully sent an update to ${channel}.`);
};

module.exports.help = {
  name: 'serverupdate',
  desc: 'Sends an update message to the channel set with `config updatechannel`!',
  category: 'misc',
  usage: '?serverupdate <Version> <Update Message>',
  aliases: ['supdate']
};
