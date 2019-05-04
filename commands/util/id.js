/**
 * @param {import('../../structures/client.js')} Client
 * @param {import('discord.js').Message} message
 * @param {String[]} args
*/
module.exports = async (Client, message, args) => {
  let x;
  if (!args[1]) x = message.member;
  else {
    const possibleMember = await Client.getObj(args[1], { guild: message.guild, type: 'member' });
    const possibleRole = Client.getObj(args[1], { guild: message.guild, type: 'role' }) || message.guild.roles.find(r => r.name.toLowerCase() === args.slice(1).join(' ').toLowerCase());
    const possibleChannel = Client.getObj(args[1], { guild: message.guild, type: 'channel' });
    if (possibleMember) x = possibleMember;
    else if (possibleRole) x = possibleRole;
    else if (possibleChannel) x = possibleChannel;
    else return Client.functions.get('argFix')(Client, message.channel, 1, 'Did not find anything with that query.');
  }

  return message.channel.send(`${message.member === x ? 'Your' : 'The'} ID is \`${x.id}\`.`);
};

module.exports.help = {
  name: 'id',
  desc: 'Displays the ID of something.',
  category: 'util',
  usage: '?id [Something]',
  aliases: []
};
