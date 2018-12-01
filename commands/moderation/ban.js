module.exports = async (Client, message, args) => {
  if (!await Client.checkPerms('ban', 'mod', message.member)) return message.reply(':x: Sorry, but you do not have the `mod.ban` permission.');
  if (!Client.checkClientPerms(message.channel, 'BAN_MEMBERS')) return message.reply('I do not have enough permissions!');

  if (!args[1]) return message.reply('You have to include a member for me to ban!');

  const regex = new RegExp('--force', 'g');

  if (!Client.matchInArray(regex, args)) {
    const member = message.guild.members.get(args[1].replace(/[<>@!?]/g, ''));
    if (!member) return message.reply('That is not a valid member! (Looking for force ban? Call the option `--force`.)');
    if (member.roles.highest.position >= message.member.roles.highest.position && message.member !== message.guild.owner) return message.reply('Your role position is not high enough!');
    if (member === message.guild.owner) return message.reply('I cannot ban an owner!');
    if (member === message.member) return message.reply('You cannot ban yourself!');
    if (message.guild.me.roles.highest.position <= member.roles.highest.position) { return message.reply('My role position is not high enough!'); }

    const reason = args.slice(2).join(' ');
    member.ban({ reason: reason });
    return message.channel.send(`Successfully banned ${member.user.tag}${reason ? ` for ${reason}` : '.'}`);
  } else {
    args.splice(args.indexOf('--force'), 1);

    const user = await Client.bot.users.fetch(args[1]).catch(() => 'failed');
    if (user === 'failed') return message.reply('That is not a valid ID!');
    const reason = args.slice(2).join(' ');

    message.guild.members.ban(user, { reason: reason });

    return message.channel.send(`Successfully force banned ${user.tag}${reason ? ` for the reason of ${reason}` : '.'}`);
  }
};

module.exports.help = {
  name: 'ban',
  desc: 'Bans a member.',
  category: 'moderation',
  usage: '?ban <Member> [Reason] [--<option>]',
  options: {
    force: 'Force bans the member, i.e bans even when the member is not in the server. An ID is required to be provided if this is the case.'
  },
  aliases: []
};
