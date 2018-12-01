module.exports = async (Client, message, args) => {
  if (!await Client.checkPerms('loop', 'music', message.member)) return message.reply(':x: Sorry, but you do not have the `music.loop` permission.');

  const guild = Client.musicfn.guilds[message.guild.id];

  if (!args[1]) return message.reply('Please include `true` or `false` depending on what you want.');

  let bool = args[1].toLowerCase();

  if (bool !== 'true' && bool !== 'false') return message.reply('Invalid argument. Please use `true` or `false`.');

  bool = bool === 'true';

  if (bool === guild.looping) return message.reply('The value is already set to that!');

  Client.musicfn.guilds[message.guild.id].loop = bool;
  return message.channel.send(`Successfully set looping to ${bool}.`);
};

module.exports.help = {
  name: 'loop',
  desc: 'Enables / Disables loop for music.',
  category: 'music',
  usage: '?loop <True or False>',
  aliases: []
};
