module.exports = async (Client, message, args) => {
  if (!await Client.checkPerms('warn', 'mod', message.member)) return message.reply(':x: Sorry, but you do not have the `mod.warn` permission.');

  if (!args[1]) return message.reply('You have to supply a user for me to warn!');
  const member = Client.getObj(args[1], { guild: message.guild, type: 'member' });
  if (!member) return message.reply('That member does not exist! Supply an ID or a mention.');
  if (member.roles.highest.position >= message.member.roles.highest.position && message.member !== message.guild.owner) return message.reply('Your role position is not high enough to warn that member!');
  if (member.user.bot) return message.reply('I cannot warn a bot!');
  if (member === message.member) return message.reply('You cannot warn yourself!');
  if (member === message.guild.owner) return message.reply('I cannot warn the owner of the server!');

  let amt = args[2];
  if (!amt) return message.reply('You have to provide an amount of total current warnings the user has!');
  if (amt.toLowerCase() !== 'cur') {
    if (isNaN(amt)) return message.reply('That amount of total warnings is not a number!');
    if (amt < 0) return message.reply('People cannot have negative warnings!');
    if (amt.includes('.')) return message.reply('A person may not have fractional warnings!');
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
