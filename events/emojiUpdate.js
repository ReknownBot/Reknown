async function logMessage (Client, oldEmoji, newEmoji) {
  const embed = new Client.Discord.MessageEmbed()
    .setTitle(`${newEmoji.animated ? 'Animated ' : ''}Emoji Edited`)
    .addField('Emoji ID', newEmoji.id)
    .addField('Old Emoji Name', oldEmoji.name, true)
    .addField('New Emoji Name', newEmoji.name, true)
    .setThumbnail(newEmoji.url)
    .setColor(0x00FFFF)
    .setTimestamp();

  if (newEmoji.guild.me.hasPermission('VIEW_AUDIT_LOG')) {
    const entry = (await newEmoji.guild.fetchAuditLogs({
      type: 'EMOJI_UPDATE',
      limit: 1
    })).entries.first();

    if (entry) {
      const executor = entry.executor;
      const reason = entry.reason || 'None';

      embed.setAuthor(`${executor.tag} (${executor.id})`, executor.displayAvatarURL())
        .addField('Reason', reason, true);
    }
  }

  return require('../functions/sendlog.js')(Client, embed, newEmoji.guild.id);
}

module.exports = async (Client, oldEmoji, newEmoji) => {
  if (!newEmoji.guild.available) return;

  logMessage(Client, oldEmoji, newEmoji);
};
