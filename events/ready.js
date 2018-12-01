module.exports = (Client) => {
  return Client.bot.on('ready', async () => {
    console.log(`Logged in as ${Client.bot.user.tag}!`);

    Client.bot.user.setActivity(`${Client.bot.users.filter(u => !u.bot).size} Users and ${Client.bot.guilds.size} Servers`, {
      type: 'WATCHING'
    });

    const { rows: dailyRows } = await Client.sql.query('SELECT * FROM daily');
    return dailyRows.forEach(row => {
      if (Date.now() - row.time > 57600000) Client.sql.query('DELETE FROM daily WHERE userid = $1', [row.userid]);
    });
  });
};
