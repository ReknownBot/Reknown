async function logMessage (Client, channel) {
  const embed = new Client.Discord.MessageEmbed()
    .setTitle('Channel Created')
    .addField('Channel', `${channel.name} \`(${channel.id})\``, true)
    .addField('Type', channel.type, true)
    .setColor(0x00FF00)
    .setTimestamp();

  if (channel.parent) embed.addField('Category', channel.parent.name, true);

  if (channel.guild.me.hasPermission('VIEW_AUDIT_LOG')) {
    const entry = (await channel.guild.fetchAuditLogs({
      type: 'CHANNEL_CREATE',
      limit: 1
    })).entries.first();
    const executor = entry.executor;
    const reason = entry.reason || 'None';

    embed.setAuthor(`${executor.tag} (${executor.id})`, executor.displayAvatarURL())
      .addField('Reason', reason, true);
  }

  return require('../functions/sendlog.js')(Client, embed, channel.guild.id);
}

module.exports = (Client, channel) => {
  if (!channel.guild || !channel.guild.available) return;

  logMessage(Client, channel);
};
