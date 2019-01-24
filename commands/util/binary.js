module.exports = async (Client, message, args) => {
  if (!Client.checkClientPerms(message.channel, 'EMBED_LINKS')) return message.reply('I require the permission `Embed Links` for this command.');

  if (!args[1]) return message.reply('You have to provide either `encode` or `decode` in the first argument.');
  const choice = args[1].toLowerCase();
  if (!['decode', 'encode'].includes(choice)) return message.reply('Your first argument was not either `encode` or `decode`!');

  if (choice === 'decode') {
    if (!args[2]) return message.reply('You have to provide binary for me to decode!');
    const binArr = Client.Discord.Util.splitMessage(args.slice(2).join(''), { maxLength: 8, char: '' });
    let decoded;
    if (typeof binArr === 'string') {
      if (binArr.length < 8 || isNaN(binArr) || binArr.includes('.') || /[^0-1]/.test(binArr)) return message.reply('Something was wrong with your binary. Please check it and run the command again.');
      decoded = String.fromCharCode(parseInt(binArr, 2));
    } else {
      if (binArr.some(bin => bin.length < 8 || bin.includes('.') || /[^0-1]/.test(bin))) return message.reply('Something was wrong with your binary. Please check it and run the command again.');
      decoded = binArr.map(bin => String.fromCharCode(parseInt(bin, 2))).join('');
    }

    const embed = new Client.Discord.MessageEmbed()
      .setTitle('Succeeded in Decoding!')
      .setColor(0x00FF00)
      .setDescription(decoded)
      .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL());
    return message.channel.send(embed);
  } else {
    if (!args[2]) return message.reply('You have to provide a string for me to encode into binary!');
    const letters = args.slice(2).join(' ').split('');
    const encoded = letters.map(letter => ('0000000' + letter.charCodeAt().toString(2)).slice(-8)).join(' ');

    if (encoded.length > 2048) return message.reply('The encoded character length is too big for me to send. Try shortening it or putting it to sections for each command.');

    const embed = new Client.Discord.MessageEmbed()
      .setTitle('Succeeded in Encoding!')
      .setColor(0x00FF00)
      .setDescription(Client.escMD(encoded))
      .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL());
    return message.channel.send(embed);
  }
};

module.exports.help = {
  name: 'binary',
  desc: 'Decodes or encodes into binary.',
  category: 'util',
  usage: '?binary encode <Text>\n?binary decode <Binary>',
  aliases: []
};
