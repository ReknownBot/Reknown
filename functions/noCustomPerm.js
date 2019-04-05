/**
 * @param {import('discord.js').Message} message
 * @param {String} perm
 */
module.exports = (message, perm) => {
  return message.reply(`:x: Sorry, but you do not have the \`${perm}\` permission.`);
};
