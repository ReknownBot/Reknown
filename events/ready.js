module.exports = (Client, bot) => {
  // Logs something
  console.log(`Logged in as ${bot.user.tag}!`);

  bot.user.setActivity('you in your sleep 👀', {
    // Sets the activity type for the bot as "Watching"
    type: 'WATCHING'
  });

  // Connects to the postgres database.
  Client.sql.connect();

  // Wipes the "mute" table from the database to preserve rows.
  return Client.sql.query('DELETE FROM mute');
};
