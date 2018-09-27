const capitalize = require('../../functions/capFirstLetter.js');

module.exports = async (Client, message, args) => {
  if (!args[1]) {
    let fields = [];
    Object.keys(Client.permissions).forEach(category => {
      category = capitalize(category);
      fields.push({
        name: category,
        value: Object.keys(Object.values(Client.permissions).find(val => Client.permissions[category.toLowerCase()] === val)).list()
      });
    });

    const embed = new Client.Discord.MessageEmbed({ fields: fields })
      .setTitle('Permission List')
      .setColor(0x00FFFF)
      .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL());

    return message.channel.send(embed);
  } else {
    const permNames = Object.values(Client.permissions).map(val => Object.keys(val)).reduce((a, b) => a.concat(b));
    if (!permNames.includes(args[1].toLowerCase())) return message.reply('The permission name you provided was not valid!');
    const permDescs = Object.values(Client.permissions).map(val => Object.values(val)).reduce((a, b) => a.concat(b));
    return message.channel.send(`**${args[1].toLowerCase()}** Info: \`${permDescs[permNames.indexOf(args[1].toLowerCase())]}\``);
  }
};

module.exports.help = {
  name: 'listperms',
  desc: 'Lists all the custom permissions for the bot.',
  category: 'misc',
  usage: '?listperms [Permission Name]',
  aliases: ['permissions', 'perms']
};
