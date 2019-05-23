/**
 * @param {import('../structures/client.js')} Client
 * @param {import('discord.js').Guild} guild
 */
function deleteRows(Client, guild) {
  Client.rows.forEach(r => Client.sql.query(`DELETE FROM ${r} WHERE guildid = $1`, [guild.id]));
}

/**
 * @param {import('../structures/client.js')} Client
 */
function updateStats(Client) {
  Client.bot.user.setActivity(`${Client.bot.users.filter(u => !u.bot).size} Users and ${Client.bot.guilds.size} Servers`, {
    type: 'WATCHING'
  });

  Client.fetch(`https://discord.bots.gg/api/v1/bots/${Client.bot.user.id}/stats`, {
    body: JSON.stringify({ guildCount: Client.bot.guilds.size }),
    headers: {
      'Authorization': process.env.DISCORD_BOTS_KEY,
      'Content-Type': 'application/json'
    },
    method: 'POST'
  });
}

/**
 * @param {import('../structures/client.js')} Client
 */
module.exports = Client => {
  return Client.bot.on('guildDelete', guild => {
    if (!guild.available) return;

    deleteRows(Client, guild);
    updateStats(Client);
  });
};
