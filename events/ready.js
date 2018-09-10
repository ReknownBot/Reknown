module.exports = (Client, bot) => {
  // Logs something
  console.log(`Logged in as ${bot.user.tag}!`);

  bot.user.setActivity(`${bot.guilds.size} Servers`, {
    // Sets the activity type for the bot as "Watching"
    type: 'WATCHING'
  });

  bot.setInterval(() => {
    // Sets the activity for the bot.
    bot.user.setActivity(`${bot.guilds.size} Servers`, {
      // Sets the activity type for the bot as "Watching"
      type: 'WATCHING'
    });
  }, 900000);

  // Connects to the postgres database.
  return Client.sql.connect();
};
