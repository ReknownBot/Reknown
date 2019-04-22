/**
 * @param {import('../../structures/client.js')} Client
 * @param {import('discord.js').Message} message
 * @param {String[]} args
*/
module.exports = async (Client, message, args) => {
  if (!args[1]) {
    if (!Client.checkClientPerms(message.channel, 'EMBED_LINKS')) return Client.functions.get('noClientPerms')(message, ['Embed Links'], message.channel);

    const fields = [];
    Object.keys(Client.permissions).forEach(category => {
      category = Client.capFirstLetter(category);
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
    if (!Object.keys(Client.permissions).includes(permCategory)) return Client.functions.get('argFix')(Client, message.channel, 1, 'The category you provided was invalid. The format should be category.permission.');
    const permName = args[1].toLowerCase().split('.')[1];
    if (!permName) return Client.functions.get('argFix')(Client, message.channel, 1, 'You have to provide a permission name. The format should be category.permission.');
    if (!Object.keys(Client.permissions[permCategory]).includes(permName)) return Client.functions.get('argFix')(Client, message.channel, 1, 'The permission name you provided was not in the category. The format should be category.permission.');
    return message.channel.send(`\`${permCategory}.${permName}\` **${Client.permissions[permCategory][permName]}**`);
  }
};

module.exports.help = {
  name: 'listperms',
  desc: 'Lists all the custom permissions for the bot.',
  category: 'misc',
  usage: '?listperms [(Permission Category).(Permission Name)]',
  aliases: ['permissions', 'perms']
};
