module.exports = async (Client, message, args) => {
  let x;
  if (!args[1]) x = message.member;
  else {
    const possibleMember = message.guild.members.get(args[1].replace(/[<>@!?]/g, ''));
    const possibleRole = message.guild.roles.get(args[1].replace(/[<>@&]/g, ''));
    const possibleChannel = message.guild.channels.get(args[1].replace(/[<>#]/g, ''));
    if (possibleMember) x = possibleMember;
    else if (possibleRole) x = possibleRole;
    else if (possibleChannel) x = possibleChannel;
    else return message.reply('The value you provided did not match anything on the server!');
  }

  return message.channel.send(`${message.member === x ? 'Your' : 'The'} ID is \`${x.id}\`.`);
};

module.exports.help = {
  name: 'id',
  desc: 'Displays the ID of a member.',
  category: 'util',
  usage: '?id [Member]',
  aliases: ['memberid']
};
