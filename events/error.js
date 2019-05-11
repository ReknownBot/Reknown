/**
 * @param {import('../structures/client.js')} Client
 */
module.exports = Client => {
  return Client.bot.on('error', console.error);
};
