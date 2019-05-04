/**
 * @param {import('../../structures/client.js')} Client
 * @param {import('discord.js').Message} message
 * @param {String[]} args
*/
module.exports = async (Client, message, args) => {
  if (!await Client.checkPerms('warn', 'mod', message.member)) return Client.functions.get('noCustomPerm')(message, 'mod.warn');

  if (!args[1]) return Client.functions.get('argMissing')(message.channel, 1, 'a member to warn');
  const member = await Client.getObj(args[1], { guild: message.guild, type: 'member' });
  if (!member) return Client.functions.get('argFix')(Client, message.channel, 1, 'Did not find a member with that query.');
  if (member.roles.highest.position >= message.member.roles.highest.position && message.member !== message.guild.owner) return message.reply('Your role position is not high enough to warn that member!');
  if (member.user.bot) return message.reply('I cannot warn a bot!');
  if (member === message.member) return message.reply('You cannot warn yourself!');
  if (member === message.guild.owner) return message.reply('I cannot warn the owner of the server!');

  let amt = args[2];
  if (!amt) return Client.functions.get('argMissing')(message.channel, 2, 'the total amount of warnings');
  if (amt.toLowerCase() !== 'cur') {
    if (isNaN(amt)) return Client.functions.get('argFix')(Client, message.channel, 2, 'The total amount of warnings must be a number.');
    if (amt < 0) return Client.functions.get('argFix')(Client, message.channel, 2, 'The total amount of warnings may not be below 0.');
    if (amt.includes('.')) return Client.functions.get('argFix')(Client, message.channel, 2, 'The total amount of warnings may not include a decimal.');
  } else {
    const warnAmtRow = (await Client.sql.query('SELECT * FROM warnings WHERE userid2 = $1', [member.id + message.guild.id])).rows[0];
    amt = warnAmtRow ? warnAmtRow.warnamount : 1;
  }

  const reason = args[3] ? args.slice(3).join(' ') : 'None';

  Client.sql.query('INSERT INTO warnings (userid2, warnamount, warnreason) VALUES ($1, $2, $3)', [member.id + message.guild.id, amt, reason]);
  return message.channel.send(`Successfully warned ${member.user.tag} for \`${Client.escMD(reason)}\` with ${amt} total warnings.`);
};

module.exports.help = {
  name: 'warn',
  desc: 'Warns a member. If "cur" is given for the total warn amount, it will add one to the warning count.',
  category: 'moderation',
  usage: '?warn <Member> <Current Total Warn Amount> [Reason]',
  aliases: []
};
