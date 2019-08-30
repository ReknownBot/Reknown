module.exports.run = async (client, message, args) => {
  if (!message.channel.permissionsFor(client.user).has('BAN_MEMBERS')) return client.functions.noClientPerms(message, message.channel, [ 'Ban Members' ]);

  if (!args[0]) return client.functions.noArg(message, 1, 'a user to ban.');
  const member = await client.functions.parseMention(args[0], message.guild, { type: 'member' }).catch(() => false);
  const reason = args[2] ? args.slice(2).join(' ') : null;
  if (member) {
    if (!member.bannable) return client.functions.badArg(message, 1, 'I do not have enough powers to ban that member. Please check my permissions and my role position. Note that I cannot ban owners.');
    member.ban({ reason: reason });
    return message.channel.send(`Successfully banned member ${client.escMD(member.user.tag)} (ID: ${member.id})${reason ? ` for reason \`${client.escMD(reason)}\`` : ''}.`);
  }

  const user = await client.functions.parseMention(args[0], message.guild, { type: 'user', client: client }).catch(() => false);
  if (!user) return client.functions.badArg(message, 1, `I did not find a user by that query (${client.escMD(args[0])}).`);
  message.guild.members.ban(user, { reason: reason });
  return message.channel.send(`Successfully banned user ${client.escMD(user.tag)} (ID: ${user.id})${reason ? ` for reason \`${client.escMD(reason)}\`` : ''}.`);
};

module.exports.help = {
  aliases: [ 'banish' ],
  category: 'Moderation',
  desc: 'Bans a user.',
  usage: 'ban <User> [Reason]'
};
