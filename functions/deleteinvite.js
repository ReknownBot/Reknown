/**
 * @param {import('../structures/client.js')} Client
 * @param {import('discord.js').Message} message
 */
module.exports = async (Client, message) => {
  const enabled = (await Client.sql.query('SELECT bool FROM deleteinvite WHERE guildid = $1 LIMIT 1', [message.guild.id])).rows[0];
  if (!enabled || !enabled.bool) return;

  if (!/(?:https?:\/\/)?discord(?:app.com\/invite|.gg)\/[\w\d]+/gi.test(message.content)) return;
  if (await Client.checkPerms('invite', 'misc', message.member)) return;
  if (!Client.checkClientPerms(message.channel, 'MANAGE_MESSAGES')) return;

  return !message.deleted ? message.delete() : null;
};
