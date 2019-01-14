module.exports = async (Client, message, args) => {
  let x;
  if (!args[1]) x = message.member;
  else {
    const possibleMember = Client.getObj(args[1], { guild: message.guild, type: 'member' });
    const possibleRole = Client.getObj(args[1], { guild: message.guild, type: 'role' }) || message.guild.roles.find(r => r.name.toLowerCase() === args.slice(1).join(' ').toLowerCase());
    const possibleChannel = Client.getObj(args[1], { guild: message.guild, type: 'channel' });
    if (possibleMember) x = possibleMember;
    else if (possibleRole) x = possibleRole;
    else if (possibleChannel) x = possibleChannel;
    else return message.reply('The value you provided did not match anything on the server!');
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
