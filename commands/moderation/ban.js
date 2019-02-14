module.exports = async (Client, message, args) => {
  if (!await Client.checkPerms('ban', 'mod', message.member)) return message.reply(':x: Sorry, but you do not have the `mod.ban` permission.');
  if (!message.guild.permissionsFor(message.guild.me).has('BAN_MEMBERS')) return message.reply('I do not have the required permission `Ban Members`!');

  if (!args[1]) return message.reply('You have to provide a member for me to ban!');

  const regex = new RegExp('--force', 'g');

  if (!Client.matchInArray(regex, args)) {
    const member = Client.getObj(args[1], { guild: message.guild, type: 'member' });
    if (!member) return message.reply('That is not a valid member! (Looking for force ban? Call the option `--force`.)');
    if (member.roles.highest.position >= message.member.roles.highest.position && message.member !== message.guild.owner) return message.reply('Your role position is not high enough to ban that member!');
    if (member === message.guild.owner) return message.reply('I cannot ban an owner!');
    if (member === message.member) return message.reply('You cannot ban yourself!');
    if (message.guild.me.roles.highest.position <= member.roles.highest.position) return message.reply('My role position is not high enough to ban that member!!');

    const reason = args[2] ? args.slice(2).join(' ') : 'None';
    member.ban({ reason: reason });
    return message.channel.send(`Successfully banned ${member.user.tag} for \`${Client.escMD(reason)}\`.`);
  } else {
    args.splice(args.indexOf('--force'), 1);

    const user = await Client.getObj(args[1], { type: 'user' });
    if (!user) return message.reply('That is not a valid ID!');

    const bans = await message.guild.fetchBans();
    if (bans.has(user.id)) return message.reply('That user is already banned!');

    const reason = args[2] ? args.slice(2).join(' ') : 'None';

    message.guild.members.ban(user, { reason: reason });

    return message.channel.send(`Successfully force banned ${user.tag} for \`${Client.escMD(reason)}\`.`);
  }
};

module.exports.help = {
  name: 'ban',
  desc: 'Bans a member.',
  category: 'moderation',
  usage: '?ban <Member> [Reason] [--<option>]',
  options: {
    force: 'Bans the user that is not in the server. An ID is required to be provided if this is the case.'
  },
  aliases: []
};
