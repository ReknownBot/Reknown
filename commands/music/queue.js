module.exports = async (Client, message, args) => {
  const server = Client.musicfn.guilds[message.guild.id];

  if (!message.guild.me.voice.channel || server.isPlaying === false) return message.reply('I am not playing anything!');
  if (!message.member.voice.channel) return message.reply('You have to be in a voice channel to use this!');
  if (message.member.voice.channel !== message.guild.me.voice.channel) return message.reply('You have to be in the same voice channel as me to use that command!');

  const arg = args[1] ? args[1].toLowerCase() : null;
  if (!arg || arg === 'list') {
    const arr = server.queueNames.map((name, index) => `**${index + 1}.** ${name}`);
    const embed = new Client.Discord.MessageEmbed()
      .setTitle('Queue')
      .setDescription(arr.join('\n'))
      .setColor(0x00FFFF)
      .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL());
    return message.channel.send(embed);
  } else if (arg === 'remove') {
    if (!await Client.checkPerms('clear', 'music', message.member)) return message.reply(':x: Sorry, but you do not have the `music.clear` permission.');

    const num = args[2];
    if (isNaN(num)) return message.reply('That is not a number!');
    if (num < 1) return message.reply('The number may not be smaller than one!');
    if (num > server.queueNames.length) return message.reply('Your number is out of range of the song count!');
    if (num.includes('.')) return message.reply('The number may not be a decimal!');

    const removedName = server.queueNames[num - 1];

    if (num === '1') {
      server.queueNames.shift();
      server.queueIDs.shift();
      server.dispatcher.end();
    } else {
      server.queueNames.splice(num - 1, 1);
      server.queueIDs.splice(num - 1, 1);
    }

    return message.channel.send(`Successfully removed \`${Client.Discord.Util.escapeMarkdown(removedName)}\``);
  } else if (arg === 'clear') {
    if (!await Client.checkPerms('clear', 'music', message.member)) return message.reply(':x: Sorry, but you do not have the `music.clear` permission.');

    server.dispatcher.end();
    return message.channel.send('Successfully cleared the queue, I\'ll be leaving the voice channel.');
  } else return message.reply('That is not a valid argument!');
};

module.exports.help = {
  name: 'queue',
  desc: 'Displays the current queue.',
  category: 'music',
  usage: '?queue OR ?queue list\n?queue remove <Song Position>\n?queue clear',
  aliases: ['q']
};
