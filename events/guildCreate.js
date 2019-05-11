/**
 * @param {import('../structures/client.js')} Client
 */
function updateActivity(Client) {
  Client.bot.user.setActivity(`${Client.bot.users.filter(u => !u.bot).size} Users and ${Client.bot.guilds.size} Servers`, {
    type: 'WATCHING'
  });
}

/**
 * @param {import('../structures/client.js')} Client
 */
module.exports = Client => {
  return Client.bot.on('guildCreate', guild => {
    if (!guild.available) return;

    updateActivity(Client);
  });
};
