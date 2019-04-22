/**
 * @param {import('../../structures/client.js')} Client
 * @param {import('discord.js').Message} message
 * @param {String[]} args
*/
module.exports = async (Client, message, args) => {
  if (!Client.checkClientPerms(message.channel, 'EMBED_LINKS')) return Client.functions.get('noClientPerms')(message, ['Embed Links'], message.channel);

  if (!args[1]) return Client.functions.get('argMissing')(message.channel, 1, 'an option; encode or decode');
  const choice = args[1].toLowerCase();
  if (!['decode', 'encode'].includes(choice)) return Client.functions.get('argFix')(Client, message.channel, 1, 'Must be `encode` or `decode`.');

  if (choice === 'decode') {
    if (!args[2]) return Client.functions.get('argMissing')(message.channel, 2, 'binary to decode');
    const binArr = Client.splitMessage(args.slice(2).join(''), { maxLength: 8, char: '' });
    let decoded;
    if (typeof binArr === 'string') {
      if (binArr.length < 8 || isNaN(binArr) || binArr.includes('.') || /[^0-1]/.test(binArr)) return Client.functions.get('argFix')(Client, message.channel, 2, 'Something was wrong with the binary.');
      decoded = String.fromCharCode(parseInt(binArr, 2));
    } else {
      if (binArr.some(bin => bin.length < 8 || bin.includes('.') || /[^0-1]/.test(bin))) return Client.functions.get('argFix')(Client, message.channel, 2, 'Something was wrong with the binary.');
      decoded = binArr.map(bin => String.fromCharCode(parseInt(bin, 2))).join('');
    }

    const embed = new Client.Discord.MessageEmbed()
      .setTitle('Succeeded in Decoding!')
      .setColor(0x00FF00)
      .setDescription(decoded)
      .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL());
    return message.channel.send(embed);
  } else {
    if (!args[2]) return Client.functions.get('argMissing')(message.channel, 2, 'a string to encode');
    const letters = args.slice(2).join(' ').split('');
    const encoded = letters.map(letter => ('0000000' + letter.charCodeAt().toString(2)).slice(-8)).join(' ');

    if (encoded.length > 2048) return Client.functions.get('argFix')(Client, message.channel, 2, 'The encoded charater length was too big for me to send (2048).');

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
