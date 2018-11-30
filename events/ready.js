module.exports = async (Client) => {
  // Logs something
  console.log(`Logged in as ${Client.bot.user.tag}!`);

  Client.bot.user.setActivity(`${Client.bot.users.filter(u => !u.bot).size} Users and ${Client.bot.guilds.size} Servers`, {
    // Sets the activity type for the bot as "Watching"
    type: 'WATCHING'
  });

  const { rows: dailyRows } = await Client.sql.query('SELECT * FROM daily');
  dailyRows.forEach(row => {
    if (Date.now() - row.time > 57600000) Client.sql.query('DELETE FROM daily WHERE userid = $1', [row.userid]);
  });

  // Connects to the postgres database.
  return Client.sql.connect();
};
