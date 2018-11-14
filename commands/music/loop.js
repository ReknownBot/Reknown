module.exports = async (Client, message, args) => {
  // If the member doesn't have permissions to use the command
  if (!await Client.checkPerms('loop', 'music', message.member)) {
    // Send a message
    return message.reply(':x: Sorry, but you do not have the `music.loop` permission.');
  }

  const guild = Client.musicfn.guilds[message.guild.id];

  // If there is no args
  if (!args[1]) {
    // Send a message
    return message.reply('Please include `true` or `false` depending on what you want.');
  }

  // Defines "bool" as the user input lowercased
  let bool = args[1].toLowerCase();

  // If none of the choices were called
  if (bool !== 'true' && bool !== 'false') {
    // Send a message
    return message.reply('Invalid argument. Please use `true` or `false`.');
  }

  // Updates "bool" to a boolean type
  bool = bool === 'true';

  // If the value is already set
  if (bool === guild.looping) {
    // Send a message
    return message.reply('The value is already set to that!');
  }

  // Updates the value
  Client.musicfn.guilds[message.guild.id].loop = bool;

  // Send a message
  return message.channel.send(`Successfully set looping to ${bool}.`);
};

module.exports.help = {
  name: 'loop',
  desc: 'Enables / Disables loop for music.',
  category: 'music',
  usage: '?loop <True or False>',
  aliases: []
};
