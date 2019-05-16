const ms = require('ms');

/**
 * @param {import('../../structures/client.js')} Client
 * @param {import('discord.js').Message} message
 * @param {String[]} args
*/
module.exports = async (Client, message, args) => {
  if (!await Client.checkPerms('mute', 'mod', message.member)) return Client.functions.get('noCustomPerm')(message, 'mod.mute');
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

  if (!args[1]) return Client.functions.get('argMissing')(message.channel, 1, 'a member to mute');

  const member = await Client.getObj(args[1], { guild: message.guild, type: 'member' });
  if (!member) return Client.functions.get('argFix')(Client, message.channel, 1, 'Did not find a member with that query.');
  if (member === message.member) return message.reply('You cannot mute yourself!');
  if (member.roles.highest.position >= message.member.roles.highest.position && message.member !== message.guild.owner) return message.reply('Your role position is not high enough for that member!');
  if (member === message.guild.owner) return message.reply('I cannot mute an owner!');
  if (member.roles.has(muteRole.id)) return Client.functions.get('argFix')(Client, message.channel, 1, 'Member is already muted.');

  if (!args[2]) return Client.functions.get('argMissing')(message.channel, 2, 'an amount of time to mute for');
  const milli = ms(args[2]);
  if (milli === undefined) return Client.functions.get('argFix')(Client, message.channel, 2, 'Could not parse an amount from that.');
  if (milli < 60000) return Client.functions.get('argFix')(Client, message.channel, 2, 'The time may not be lower than 1 minute.');
  if (milli > 1000 * 60 * 60 * 24 * 3) return Client.functions.get('argFix')(Client, message.channel, 2, 'The maximum time to mute for is 3 days..');

  const reason = args[3] ? args.slice(3).join(' ') : 'None';

  const timeout = setTimeout(() => {
    Client.sql.query('DELETE FROM mute WHERE userid = $1 AND guildid = $2', [member.id, message.guild.id]);
    clearTimeout(Client.mutes.get(member.id));
    Client.mutes.delete(member.id);

    if (!message.guild || !message.guild.me || !message.guild.me.hasPermission('MANAGE_ROLES') || !muteRole) return;
    if (muteRole.position >= message.guild.me.roles.position) return;

    return member.roles.remove(muteRole);
  }, milli);
  Client.sql.query('INSERT INTO mute (userid, guildid, time, mutedat) VALUES ($1, $2, $3, $4)', [member.id, message.guild.id, milli, Date.now()]);
  Client.mutes.set(member.id, timeout);
  member.roles.add(muteRole);
  return message.channel.send(`Successfully muted ${member.user.tag} for \`${Client.escMD(reason)}\` and will be unmuted in ${args[2]}.`);
};

module.exports.help = {
  name: 'mute',
  desc: 'Mutes a member.',
  category: 'moderation',
  usage: '?mute <Member> <Time> [Reason]',
  aliases: ['silence']
};
