async function logMessage (Client, message) {
  const embed = new Client.Discord.MessageEmbed()
    .setTitle('Message Deleted')
    .addField('Channel', message.channel)
    .setColor(0xFF0000)
    .setTimestamp();

  if (!message.content && message.embeds[0]) return;
  else if (message.attachments.first() && message.attachments.first().width) embed.setImage(message.attachments.first().proxyURL);

  if (message.content) embed.addField('Content', message.content);
  else if (!embed.image) return;

  if (message.guild.me.hasPermission('VIEW_AUDIT_LOG')) {
    const entry = (await message.guild.fetchAuditLogs({
      type: 'MESSAGE_DELETE',
      limit: 1
    })).entries.first();
    const executor = entry.executor;
    const reason = entry.reason || 'None';

    if (Date.now() - entry.createdTimestamp < 7000) embed.setAuthor(`${executor.tag} (${executor.id})`, executor.displayAvatarURL()).addField('Author', message.author, true);
    else embed.setAuthor(`${message.author.tag} (${message.author.id})`, message.author.displayAvatarURL());

    embed.addField('Reason', reason, true);
  }

  return require('../functions/sendlog.js')(Client, embed, message.guild.id);
}

module.exports = (Client, message) => {
  if (!message.guild || !message.guild.available) return;
  if (message.author.bot) return;

  logMessage(Client, message);
};
