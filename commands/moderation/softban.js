module.exports = async (Client, message, args) => {
  if (!await Client.checkPerms('softban', 'mod', message.member)) return message.reply(':x: Sorry, but you do not have the `mod.softban` permission.');
  if (!message.guild.hasPermission(message.guild.me).has('BAN_MEMBERS')) return message.reply('I do not have the required permission `Ban Members`.');

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

  const member = Client.getObj(args[1], { guild: message.guild, type: 'member' });
  if (!member) return message.reply('The member you provided was invalid!');
  if (member === message.member) return message.reply('You cannot softban yourself!');
  if (message.member.roles.highest.position <= member.roles.highest.position && message.member !== message.guild.owner) return message.reply('Your role position is not high enough to softban that member!');
  if (message.guild.me.roles.highest.position <= member.roles.highest.position) return message.reply('My role position is not high enough to softban that member!');
  if (member === message.guild.owner) return message.reply('I cannot ban an owner!');

  const reason = args[2] ? args.slice(2).join(' ') : 'None';
  await member.ban({
    reason: reason,
    days: days
  });
  const msg = await message.channel.send('Awaiting unban...');
  await message.guild.members.unban(member.id);
  return msg.deleted ? msg.edit(`Successfully softbanned ${Client.escMD(member.user.tag)} for \`${Client.escMD(reason)}\`.`) : null;
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
