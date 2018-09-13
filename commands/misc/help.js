const categoryObj = {
  'bot list': 'Bot List',
  'fun': 'Fun',
  'music': 'Music',
  'moderation': 'Moderation',
  'misc': 'Miscellaneous',
  'minigames': 'Minigames'
};

module.exports = async (Client, message, args) => {
  if (!args[1]) {
    const embed = new Client.Discord.MessageEmbed()
      .setTitle('Command List')
      .setColor(0x00FFFF);

    Object.values(Client.commands).forEach(cmd => {
      if (cmd.private && message.author.id !== '288831103895076867') return;
      const name = cmd.help.name;
      const category = categoryObj[cmd.help.category];
      const field = embed.fields.find(field => field.name === category);
      if (!field) {
        embed.addField(category, name);
      } else field.value += `\n${name}`;
    });

    message.author.send(embed)
      .then(() => message.reply('I have send a list of commands to your DMs.'))
      .catch(e => {
        if (e == 'DiscordAPIError: Cannot send messages to this user') {
          message.reply('I could not send the message to you. If you want to view the commands, either hop over to our website (<https://reknownbot.herokuapp.com/commands>) or enable DMs.');
        } else process.emit('unhandledRejection', e);
      });
  } else {
    if (!Object.keys(Client.allAlias).includes(args[1].toLowerCase())) return message.reply(`I did not find \`${args[1]}\` in my command list.`);
    const cmd = Client.allAlias[args[1].toLowerCase()];
    const cmdInfo = Client.commands[cmd];
    const options = cmdInfo.help.options;
    if (cmdInfo.private && message.author.id !== '288831103895076867') return message.reply('Sorry, but that command is private.');
    const embed = new Client.Discord.MessageEmbed()
      .setTitle(`${cmd} Info`)
      .setColor(0x00FFFF)
      .addField('Aliases', cmdInfo.help.aliases[0] ? cmdInfo.help.aliases.list() : 'None', true)
      .addField('Description', cmdInfo.help.desc, true)
      .addField('Category', categoryObj[cmdInfo.help.category], true)
      .addField('Usage', cmdInfo.help.usage, true)
      .addField('Options', typeof options === 'object' ? Object.keys(options).map(option => `--${option} | ${cmdInfo.help.options[option]}`) : 'None')
      .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL());

    message.channel.send(embed);
  }
};

module.exports.help = {
  name: 'help',
  desc: 'Displays commands.',
  category: 'misc',
  usage: '?help [Command Name]',
  aliases: ['commands']
};
