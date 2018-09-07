module.exports = (Client, bot) => {
    // Logs something
    console.log(`Logged in as ${bot.user.tag}!`);

    // Sets the activity for the bot.
    bot.user.setActivity(`${bot.guilds.size} Servers`, {
        // Sets the activity type for the bot as "Watching"
        type: 'WATCHING'
    });

    // Connects to the postgres database.
    return Client.sql.connect();
}