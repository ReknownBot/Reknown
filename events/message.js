module.exports = async (Client, message) => {
  // If the author is a bot, return. This is to stop "botsceptions".
  if (message.author.bot) return;

  // If the message was sent in a DM
  if (message.channel.type === 'dm') {
    // Returns & Sends a message
    return message.channel.send('You cannot use me in a DM, please use a server.');
  }

  // If the guild is not available
  if (!message.guild.available) return;

  // Defines "permissions" as the bot's permissions for the channel.
  const permissions = message.channel.permissionsFor(message.client.user);
  if (!permissions.has('VIEW_CHANNEL') || !permissions.has('SEND_MESSAGES')) return;

  // If there is no object for the music functions
  if (!Client.musicfn.guilds[message.guild.id]) {
    // Defines the object
    Client.musicfn.guilds[message.guild.id] = {
      queueIDs: [],
      queueNames: [],
      skippers: [],
      skips: 0,
      searching: false,
      loop: false,
      volume: 50,
      voiceChannel: null,
      dispatcher: null,
      isPlaying: false
    };
  }

  // Level function
  require('../functions/level.js')(Client, message);

  // Gets the prefix for the server.
  const row = (await Client.sql.query('SELECT * FROM prefix WHERE guildId = $1 LIMIT 1', [message.guild.id])).rows[0];

  // Updates Client.prefix as the custom prefix. If the server does not have one, then use the default.
  Client.prefix = row ? row.customprefix : '?';

  // Creates a Regex for the bot mention.
  const regexp = new RegExp(`^<@!?${message.client.user.id}> `);

  // If the message didn't start with the prefix AND with a mention OR it IS the prefix, return
  if ((!message.content.startsWith(Client.prefix) && !message.content.match(regexp)) || message.content === Client.prefix) return;

  // Defines args as nothing.
  let args;

  // If the message content started with the mention and a command
  if (message.content.match(regexp)) {
    // Updates "args" as a string sliced by the length of the mention split by spaces
    args = message.content.slice(message.content.match(regexp)[0].length).split(/ +/g);
  } else {
    // Updates "args" as a string sliced by the length of the prefix split by spaces
    args = message.content.slice(Client.prefix.length).split(/ +/g);
  }

  // Defines "command" as the first word of the message lowercased.
  const command = args[0].toLowerCase();

  // If the command is not found
  if (!(command in Client.commands) && !Client.allAlias[command]) {
    // Checks if the unknown command message is enabled on the server
    const unknownCmd = (await Client.sql.query('SELECT * FROM cmdnotfound WHERE guildid = $1 AND bool = $2', [message.guild.id, 1])).rows[0];
    if (unknownCmd) {
      // Gets the closest strings for the command
      const cmds = Client.getFuzz(command);

      // Sends a message
      message.reply(`I did not find that command. Did you mean \`${cmds[0][0]}, ${cmds[1][0]}, or ${cmds[2][0]}\`?`);
    }
    // Returns
    return;
  }

  // If the member is uncached
  if (!message.member) {
    // Updates message.member as the cached member, and adds it to cache
    message.member = await message.guild.members.fetch({
      user: message.author,
      cache: true
    });
  }

  // If the bot is not cached
  if (!message.guild.me) {
    // Fetch the bot, and store it in message.guild.me
    message.guild.me = await message.guild.members.fetch({
      user: Client.bot.user,
      cache: true
    });
  }

  // If the command executed was not an alias
  if (command in Client.commands) {
    // Executes the function
    return Client.commands[command](Client, message, args);
  } else { // If it is an alias
    for (const val in Client.allAlias) {
      const prop = Client.allAlias[val];
      if (val === command) {
        Client.commands[prop](Client, message, args);
        break;
      }
    }
  }
};
