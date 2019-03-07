/**
 * @param {import('../../structures/client.js')} Client
 * @param {import('discord.js').Message} message
 * @param {String[]} args
*/
module.exports = async (Client, message, args) => {
  if (!Client.checkClientPerms(message.channel, 'EMBED_LINKS')) return message.reply('I am missing the required permission `Embed Links`.');

  const user = args[1] ? await Client.getObj(args[1], { type: 'user' }) : message.author;
  if (!user) return message.reply('The user you provided was invalid!');

  const inGuild = message.guild.members.has(user.id);

  const embed = new Client.Discord.MessageEmbed()
    .setTitle(`${user.tag}'s User Info`)
    .setColor(inGuild ? message.guild.members.get(user.id).displayHexColor : 0x00FFFF)
    .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL())
    .setTimestamp()
    .setThumbnail(user.displayAvatarURL())
    .addField('Created At', Client.dateFormat(user.createdAt), true)
    .addField('Status', Client.capFirstLetter(user.presence.status), true);

  if (inGuild) {
    const member = message.guild.members.get(user.id);

    const memSort = message.guild.members.sort((a, b) => {
      return a.joinedTimestamp - b.joinedTimestamp;
    }).array();
    let position = 0;
    for (let i = 0; i < memSort.length; i++) {
      position++;
      if (memSort[i].id === user.id) break;
    }

    embed.addField('Joined At', Client.dateFormat(member.joinedAt), true)
      .addField('Joined Position', position, true);
  }

  if (user.presence.activity) embed.addField('Game', user.presence.activity.name);

  return message.channel.send(embed);
};

module.exports.help = {
  name: 'userinfo',
  desc: 'Displays user info about the user mentioned.',
  category: 'util',
  usage: '?userinfo [User]',
  aliases: ['profile', 'uinfo', 'whois']
};
