module.exports = async (Client, message, args) => {
  if (!await Client.checkPerms('mute', 'mod', message.member)) return message.reply(':x: Sorry, but you do not have the `mod.mute` permission.');

  let muteRole = message.guild.roles.find(r => r.name.toLowerCase() === 'muted');
  if (!muteRole) {
    message.channel.send('I did not find a "Muted" role. Would you like me to create one for you? Reply with "yes" or "no".');
    const filter = m => m.author.id === message.author.id && m.channel.id === message.channel.id;
    const messages = await message.channel.awaitMessages(filter, { time: 15000, max: 1 });
    if (!messages.first()) return message.reply('I did not get a reply in time, canceling action.');

    let m = messages.first();
    if (!['yes', 'no'].includes(m.content)) return message.reply('That reply was invalid! Canceling action.');
    if (m.content === 'no') return message.channel.send('Ok.');

    if (!message.guild.me.hasPermission('MANAGE_ROLES')) return message.reply('I do not have enough permissions to create a role! Canceling action.');
    muteRole = await message.guild.roles.create({
      data: {
        name: 'Muted',
        color: '#727272',
        permissions: message.guild.defaultRole.permissions.remove('SPEAK', 'SEND_MESSAGES', 'ADD_REACTIONS')
      },
      reason: 'Reknown Mute Command'
    });
    message.channel.send('Successfully created a role. Proceeding with the command.');
  }

  if (!args[1]) return message.reply('You have to provide a member for me to mute!');

  const member = message.guild.members.get(args[1].replace(/[<>@!?]/g, ''));
  if (!member) return message.reply('The member you provided is invalid or is not in the server!');
  if (member === message.member) return message.reply('You cannot mute yourself!');
  if (member.roles.highest.position >= message.member.roles.highest.position && message.member !== message.guild.owner) return message.reply('Your role position is not high enough for that member!');
  if (member === message.guild.owner) return message.reply('I cannot mute an owner!');
  if (member.roles.has(muteRole.id)) return message.reply('That member is already muted!');

  const reason = args[2] ? args.slice(2).join(' ') : 'None';

  Client.mutes.push(member.id);
  member.roles.add(muteRole);
  return message.channel.send(`Successfully muted ${member.user.tag} for \`${Client.escMD(reason)}\`.`);
};

module.exports.help = {
  name: 'mute',
  desc: 'Mutes a member.',
  category: 'moderation',
  usage: '?mute <Member> [Reason]',
  aliases: ['silence']
};
