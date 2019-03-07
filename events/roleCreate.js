/**
 * @param {import('../structures/client.js')} Client
 * @param {import('discord.js').Role} role
 */
async function logMessage(Client, role) {
  const embed = new Client.Discord.MessageEmbed()
    .setTitle('Role Created')
    .setColor(0x00FF00)
    .setTimestamp()
    .addField('Role', `${Client.escMD(role.name)} \`${role.id}\``);

  if (role.guild.me.hasPermission('VIEW_AUDIT_LOG')) {
    const entry = (await role.guild.fetchAuditLogs({
      type: 'ROLE_CREATE',
      limit: 1
    })).entries.first();

    if (entry) {
      const executor = entry.executor;
      const reason = entry.reason || 'None';

      embed.setAuthor(`${executor.tag} (${executor.id})`, executor.displayAvatarURL())
        .addField('Reason', reason, true);
    }
  }

  return Client.functions.get('sendlog')(Client, embed, role.guild.id);
}

/**
 * @param {import('../structures/client.js')} Client
 */
module.exports = (Client) => {
  return Client.bot.on('roleCreate', role => {
    if (!role.guild.available) return;

    logMessage(Client, role);
  });
};
