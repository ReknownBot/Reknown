module.exports = async (Client, message, args) => {
  let member;
  if (!args[1]) member = message.member;
  else member = message.guild.members.get(args[1].replace(/[<>@!?]/g, ''));

  if (!member) return message.reply('The member you provided was not valid!');
  return message.channel.send(`${message.member === member ? 'Your' : `${member.user.tag}'s`} ID is \`${member.id}\`.`);
};

module.exports.help = {
  name: 'id',
  desc: 'Displays the ID of a member.',
  category: 'util',
  usage: '?id [Member]',
  aliases: ['memberid']
};
