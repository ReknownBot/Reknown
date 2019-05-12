function clean(text) {
  if (typeof (text) === 'string') {
    return text.replace(/`/g, '`' + String.fromCharCode(8203)).replace(/@/g, '@' + String.fromCharCode(8203));
  }

  return text;
}

/**
 * @param {import('../../structures/client.js')} Client
 * @param {import('discord.js').Message} message
 * @param {String[]} args
 */
module.exports = (Client, message, args) => {
  if (message.author.id !== Client.ownerID) return message.reply('Only the bot owner may use this command!');
  if (!Client.checkClientPerms(message.channel, 'EMBED_LINKS')) return Client.functions.get('noClientPerms')(message, ['Embed Links'], message.channel);

  const code = args.slice(1).join(' ');
  if (!code) return Client.functions.get('argMissing')(message.channel, 1, 'code to evaluate');

  try {
    // eslint-disable-next-line no-eval
    let evaled = eval(code);
    if (typeof (evaled) !== 'string') evaled = require('util').inspect(evaled);

    const embed = new Client.Discord.MessageEmbed()
      .setAuthor('Evaluation')
      .setTitle('Output')
      .setDescription(`\`\`\`xl\n${clean(evaled).length <= 2048 ? clean(evaled) : 'Over 2,048 Characters'}\n\`\`\``)
      .setColor(0x00FFFF)
      .setTimestamp();
    message.channel.send(embed);
  } catch (e) {
    message.channel.send(`\`ERROR\` \`\`\`xl\n${clean(e)}\n\`\`\``);
  }
};

module.exports.help = {
  name: 'eval',
  desc: 'Evaluates code.',
  category: 'misc',
  usage: '?eval <Code>',
  aliases: []
};

module.exports.private = true;
