/**
 * @param {import('../structures/client.js')} Client
 * @param {import('discord.js').Guild} guild
 * @param {import('discord.js').User} user
 */
async function logMessage(Client, guild, user) {
  const embed = new Client.Discord.MessageEmbed()
    .setTitle('Member Unbanned')
    .addField('Member', `${user.tag} (${user.id})`, true)
    .setThumbnail(user.displayAvatarURL({ size: 2048 }))
    .setColor(0x00FF00)
    .setTimestamp();

  if (guild.me.hasPermission('VIEW_AUDIT_LOG')) {
    const entry = (await guild.fetchAuditLogs({
      type: 'MEMBER_BAN_REMOVE',
      limit: 1
    })).entries.first();

    if (entry) {
      const executor = entry.executor;
      if (executor.partial) await executor.fetch();

      const reason = entry.reason || 'None';

      embed.setAuthor(`${executor.tag} (${executor.id})`, executor.displayAvatarURL())
        .addField('Reason', reason, true);
    }
  }

  return Client.functions.get('sendlog')(Client, embed, guild.id);
};

/**
 * @param {import('../structures/client.js')} Client
 */
module.exports = (Client) => {
  return Client.bot.on('guildBanRemove', async (guild, user) => {
    if (user.partial) await user.fetch();
    if (user === Client.bot.user) return;
    if (!guild || !guild.available) return;

    logMessage(Client, guild, user);
  });
};
