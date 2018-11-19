module.exports = async (Client, message, args) => {
  if (!await Client.checkPerms('softban', 'mod', message.member)) return message.reply(':x: Sorry, but you do not have the `mod.softban` permission.');
  if (!args[1]) return message.reply('You have to supply a member for me to softban!');
  const regex = new RegExp('--days [0-9]+');
  let days;
  if (!regex.test(args.join(' '))) days = 7;
  else {
    days = args.join(' ').match(/--days [0-9]+/)[0].split(' ')[1];
    if (days > 14) return message.reply('The maximum days to softban is 14!');
    if (days < 0) return message.reply('I cannot softban for negatives!');
    args.splice(args.indexOf('--days'), 2);
  }

  const member = message.guild.members.get(args[1].replace(/[@<>!?]/g, ''));
  if (!member) return message.reply('That is not a member!');
  if (member === message.member) return message.reply('You cannot softban yourself!');
  if (message.member.roles.highest.position <= member.roles.highest.position && message.member !== message.guild.owner) return message.reply('Your role position is not high enough!');
  if (message.guild.me.roles.highest.position <= member.roles.highest.position) return message.reply('My role position is not high enough!');
  if (member === message.guild.owner) return message.reply('I cannot ban an owner!');

  const reason = args.slice(2).join(' ');
  await member.ban({
    reason: reason,
    days: days
  });
  const msg = await message.channel.send('Awaiting unban...');
  await message.guild.unban(member.id);
  return msg.deleted ? msg.edit(`Successfully soft banned ${member.user.tag}${reason ? 'for ' + reason : '.'}`) : null;
};

module.exports.help = {
  name: 'softban',
  desc: 'Softbans a member.',
  category: 'moderation',
  usage: '?softban <Member> [Reason] [--days <Days to delete messages>]',
  options: {
    days: 'Sets the amount of days to delete the member\'s messages. Defaults to 7 and maximum is 14.'
  },
  aliases: ['sban']
};
