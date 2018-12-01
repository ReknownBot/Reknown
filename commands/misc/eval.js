function clean (text) {
  if (typeof (text) === 'string') {
    return text.replace(/`/g, '`' + String.fromCharCode(8203)).replace(/@/g, '@' + String.fromCharCode(8203));
  }

  return text;
}

module.exports = async (Client, message, args) => {
  if (message.author.id !== '288831103895076867') return message.reply('Only the bot owner may use this command!');

  const code = args.slice(1).join(' ');
  if (!code) return message.reply('Please give me code to evaluate.');

  try {
    // eslint-disable-next-line no-eval
    let evaled = await eval(code);
    if (typeof (evaled) !== 'string') evaled = require('util').inspect(evaled);

    let embed = new Client.Discord.MessageEmbed()
      .setAuthor('Evaluation')
      .setTitle('Output')
      .setDescription(`\`\`\`xl\n${clean(evaled).length <= 2048 ? clean(evaled) : 'Over 2048 Characters'}\n\`\`\``)
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
