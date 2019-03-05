async function logMessage (Client, oldChannel, newChannel) {
  const embed = new Client.Discord.MessageEmbed()
    .setTitle('Channel Updated')
    .addField('Name Change', `\`${Client.escMD(oldChannel.name)}\` => \`${Client.escMD(newChannel.name)}\``, true)
    .addField('Type', oldChannel.type, true)
    .setColor(0xff7700)
    .setTimestamp();

  if (oldChannel.guild.me.hasPermission('VIEW_AUDIT_LOG')) {
    const entry = (await oldChannel.guild.fetchAuditLogs({
      type: 'CHANNEL_UPDATE',
      limit: 1
    })).entries.first();

    if (entry) {
      const executor = entry.executor;
      const reason = entry.reason || 'None';

      embed.setAuthor(`${executor.tag} (${executor.id})`, executor.displayAvatarURL())
        .addField('Reason', reason, true);
    }
  }

  return Client.functions.get('sendlog')(Client, embed, oldChannel.guild.id);
}

module.exports = (Client) => {
  return Client.bot.on('channelUpdate', (oldChannel, newChannel) => {
    if (!oldChannel.guild.available) return;
    if (oldChannel.name === newChannel.name) return;

    logMessage(Client, oldChannel, newChannel);
  });
};
