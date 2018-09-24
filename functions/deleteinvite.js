module.exports = async (Client, message) => {
  // If the message does not contain an invite
  if (!/(?:https?:\/\/)?discord(?:app.com\/invite|.gg)\/[\w\d]+/gi.test(message.content)) return;

  // If the member is allowed to post invites on the server
  if (await Client.checkPerms('invite', 'misc', message.member)) return;

  // If the bot does not have permissions to delete messages
  if (!Client.checkClientPerms(message.channel, 'MANAGE_MESSAGES')) return;

  return !message.deleted ? message.delete() : null;
};
