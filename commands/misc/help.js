const categoryObj = {
  'bot list': 'Bot List',
  'fun': 'Fun',
  'music': 'Music',
  'moderation': 'Moderation',
  'misc': 'Miscellaneous',
  'minigames': 'Minigames',
  'util': 'Utility',
  'economy': 'Economy'
};

/**
 * @param {import('../../structures/client.js')} Client
 * @param {import('discord.js').Message} message
 * @param {String[]} args
*/
module.exports = async (Client, message, args) => {
  if (!args[1]) {
    const embed = new Client.Discord.MessageEmbed()
      .setTitle('Command List')
      .setColor(0x00FFFF);

    Object.values(Client.commands).forEach(cmd => {
      if (cmd.private && message.author.id !== Client.ownerID) return;
      const name = cmd.help.name;
      const category = categoryObj[cmd.help.category];
      const field = embed.fields.find(field => field.name === category);
      if (!field) {
        embed.addField(category, `\`${name}\``);
      } else field.value += `, \`${name}\``;
    });

    return message.author.send(embed)
      .then(() => message.reply('I have sent a list of commands to your DMs.'))
      .catch(e => {
        if (e == 'DiscordAPIError: Cannot send messages to this user') {
          if (!Client.checkClientPerms(message.channel, 'EMBED_LINKS')) return message.reply('I could not send a DM message to you, and I do not have the permission `Embed Links` in this channel.');
          return message.channel.send(embed);
        } else process.emit('unhandledRejection', e);
      });
  } else {
    if (!Client.checkClientPerms(message.channel, 'EMBED_LINKS')) return Client.functions.get('noClientPerms')(message, ['Embed Links'], message.channel);

    if (!Object.keys(Client.allAlias).includes(args[1].toLowerCase())) return Client.functions.get('argFix')(Client, message.channel, 1, 'Did not find that command in my commands list.');
    const cmd = Client.allAlias[args[1].toLowerCase()];
    const cmdInfo = Client.commands[cmd];
    const options = cmdInfo.help.options;
    if (cmdInfo.private && message.author.id !== Client.ownerID) return Client.functions.get('argFix')(Client, message.channel, 1, 'That command is private.');
    const embed = new Client.Discord.MessageEmbed()
      .setTitle(`${cmd} Info`)
      .setColor(0x00FFFF)
      .addField('Aliases', cmdInfo.help.aliases[0] ? cmdInfo.help.aliases.list() : 'None', true)
      .addField('Description', cmdInfo.help.desc, true)
      .addField('Category', categoryObj[cmdInfo.help.category], true)
      .addField('Usage', cmdInfo.help.usage, true)
      .addField('Options', typeof options === 'object' ? Object.keys(options).map(option => `--${option} | ${cmdInfo.help.options[option]}`) : 'None', true)
      .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL());

    return message.channel.send(embed);
  }
};

module.exports.help = {
  name: 'help',
  desc: 'Displays commands.',
  category: 'misc',
  usage: '?help [Command Name]',
  aliases: ['commands']
};
