module.exports = async (Client, message, args) => {
  if (!await Client.checkPerms('mute', 'mod', message.member)) return message.reply(':x: Sorry, but you do not have the `mod.mute` permission.');
  if (!message.guild.me.hasPermission('MANAGE_ROLES')) return Client.functions.get('noClientPerms')(message, ['Manage Roles']);

  let muteRole = message.guild.roles.find(r => r.name.toLowerCase() === 'muted');
  if (!muteRole) {
    message.channel.send('I did not find a "Muted" role. Would you like me to create one for you? Reply with "yes" or "no".');
    const filter = m => m.author.id === message.author.id && m.channel.id === message.channel.id;
    const messages = await message.channel.awaitMessages(filter, { time: 15000, max: 1 });
    if (!messages.first()) return message.reply('I did not get a reply in time, canceling action.');

    const m = messages.first();
    if (!['yes', 'no'].includes(m.content)) return message.reply('That reply was invalid! Canceling action.');
    if (m.content === 'no') return message.channel.send('Ok.');

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

  const member = Client.getObj(args[1], { guild: message.guild, type: 'member' });
  if (!member) return message.reply('The member you provided is invalid or is not in the server!');
  if (member === message.member) return message.reply('You cannot mute yourself!');
  if (member.roles.highest.position >= message.member.roles.highest.position && message.member !== message.guild.owner) return message.reply('Your role position is not high enough for that member!');
  if (member === message.guild.owner) return message.reply('I cannot mute an owner!');
  if (member.roles.has(muteRole.id)) return message.reply('That member is already muted!');

  if (!args[2]) return message.reply('You have to provide a length of time for me to mute that member for!');
  const time = args[2].slice(0, -1);
  if (isNaN(time)) return message.reply('The time you provided is not a number!');
  if (time < 1) return message.reply('The time may not be smaller than one!');
  if (time.includes('.')) return message.reply('The time cannot be a decimal!');
  const type = args[2].slice(-1).toLowerCase();
  if (!['s', 'm', 'h'].includes(type)) return message.reply('The type you provided was invalid! The type can be one of the following: `s`, `m`, or `h`.');
  if (type === 's' && time > 172800) return message.reply('The max amount of seconds is 172,800!');
  if (type === 'm' && time > 2880) return message.reply('The max amount of minutes is 2,880!');
  if (type === 'h' && time > 48) return message.reply('The max amount of hours is 48!');

  let ms = time;
  switch (type) {
    case 's':
      ms *= 1000;
      break;
    case 'm':
      ms *= 60000;
      break;
    case 'h':
      ms *= 3600000;
  }

  const reason = args[3] ? args.slice(3).join(' ') : 'None';

  const timeout = setTimeout(() => {
    Client.sql.query('DELETE FROM mute WHERE userid = $1 AND guildid = $2', [member.id, message.guild.id]);
    clearTimeout(Client.mutes.get(member.id));
    Client.mutes.delete(member.id);

    if (!message.guild || !message.guild.me || !message.guild.me.hasPermission('MANAGE_ROLES') || !muteRole) return;
    if (muteRole.position >= message.guild.me.roles.position) return;

    return member.roles.remove(muteRole);
  }, ms);
  Client.sql.query('INSERT INTO mute (userid, guildid, time, mutedat) VALUES ($1, $2, $3, $4)', [member.id, message.guild.id, ms, Date.now()]);
  Client.mutes.set(member.id, timeout);
  member.roles.add(muteRole);
  return message.channel.send(`Successfully muted ${member.user.tag} for \`${Client.escMD(reason)}\` and will be unmuted in ${time + type}.`);
};

module.exports.help = {
  name: 'mute',
  desc: 'Mutes a member.',
  category: 'moderation',
  usage: '?mute <Member> <Time> [Reason]',
  aliases: ['silence']
};
