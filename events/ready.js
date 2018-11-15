module.exports = (Client, bot) => {
  // Logs something
  console.log(`Logged in as ${bot.user.tag}!`);

  bot.user.setActivity(`${bot.users.filter(u => !u.bot).size} Users and ${bot.guilds.size} Servers`, {
    // Sets the activity type for the bot as "Watching"
    type: 'WATCHING'
  });

  // Connects to the postgres database.
  return Client.sql.connect();
};
