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
module.exports = Client => {
  return Client.bot.on('guildDelete', guild => {
    if (!guild.available) return;

    deleteRows(Client, guild);
  });
};
