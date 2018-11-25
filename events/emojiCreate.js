async function logMessage (Client, emoji) {
  const embed = new Client.Discord.MessageEmbed()
    .setTitle(`${emoji.animated ? 'Animated ' : ''}Emoji Created`)
    .addField('Emoji ID', emoji.id, true)
    .addField('Emoji Name', emoji.name, true)
    .setThumbnail(emoji.url)
    .setColor(0x00FF00)
    .setTimestamp();

  if (emoji.guild.me.hasPermission('VIEW_AUDIT_LOG')) {
    const entry = (await emoji.guild.fetchAuditLogs({
      type: 'EMOJI_CREATE',
      limit: 1
    })).entries.first();

    if (entry) {
      const executor = entry.executor;
      const reason = entry.reason || 'None';

      embed.setAuthor(`${executor.tag} (${executor.id})`, executor.displayAvatarURL())
        .addField('Reason', reason, true);
    }
  }

  return require('../functions/sendlog.js')(Client, embed, emoji.guild.id);
}

module.exports = async (Client, emoji) => {
  if (!emoji.guild.available) return;

  logMessage(Client, emoji);
};
