const capitalize = require('../../functions/capFirstLetter.js');

module.exports = async (Client, message, args) => {
  if (!args[1]) {
    const fields = [];
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
    const permCategory = args[1].toLowerCase().split('.')[0];
    if (!Object.keys(Client.permissions).includes(permCategory)) return message.reply('The permission category you provided was invalid!');
    const permName = args[1].toLowerCase().split('.')[1];
    if (!permName) return message.reply('You have to provide a permission name!\n\n`Eg. ?listperms mod.ban`');
    if (!Object.keys(Client.permissions[permCategory]).includes(permName)) return message.reply('The permission name you provided was invalid!');
    return message.channel.send(`${permCategory}.${permName} | ${Client.permissions[permCategory][permName]}`);
  }
};

module.exports.help = {
  name: 'listperms',
  desc: 'Lists all the custom permissions for the bot.',
  category: 'misc',
  usage: '?listperms [(Permission Category).(Permission Name)]',
  aliases: ['permissions', 'perms']
};
