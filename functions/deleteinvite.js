module.exports = async (Client, message) => {
  const enabled = (await Client.sql.query('SELECT bool FROM deleteinvite WHERE guildid = $1 LIMIT 1', [message.guild.id])).rows[0];
  if (!enabled || !enabled.bool) return;

  // If the message does not contain an invite
  if (!/(?:https?:\/\/)?discord(?:app.com\/invite|.gg)\/[\w\d]+/gi.test(message.content)) return;

  // If the member is allowed to post invites on the server
  if (await Client.checkPerms('invite', 'misc', message.member)) return;

  // If the bot does not have permissions to delete messages
  if (!Client.checkClientPerms(message.channel, 'MANAGE_MESSAGES')) return;

  return !message.deleted ? message.delete() : null;
};
