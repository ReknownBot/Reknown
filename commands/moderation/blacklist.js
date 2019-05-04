/**
 * @param {import('../../structures/client.js')} Client
 * @param {import('discord.js').Message} message
 * @param {String[]} args
*/
module.exports = async (Client, message, args) => {
  if (!await Client.checkPerms('blacklist', 'mod', message.member)) return Client.functions.get('noCustomPerm')(message, 'mod.blacklist');

  if (!args[1]) return Client.functions.get('argMissing')(message.channel, 1, 'a member to blacklist');
  const member = await Client.getObj(args[1], { guild: message.guild, type: 'member' });
  if (!member) return Client.functions.get('argFix')(Client, message.channel, 1, 'The member provided was invalid.');
  if (member.roles.highest.position >= message.member.roles.highest.position && message.member !== message.guild.owner) return message.reply('Your role position is not high enough!');
  if (member === message.member) return message.reply('You cannot blacklist yourself!');
  if (member === message.guild.owner) return message.reply('I cannot blacklist the owner!');

  const blacklisted = (await Client.sql.query('SELECT by, reason FROM blacklist WHERE guildid = $1 AND userid = $2', [message.guild.id, member.id])).rows[0];
  if (blacklisted) return Client.functions.get('argFix')(Client, message.channel, 1, `That member is already blacklisted by ${blacklisted.by} for \`${Client.escMD(blacklisted.reason)}\`.`);

  const reason = args[2] ? args.slice(2).join(' ') : 'None';
  Client.sql.query('INSERT INTO blacklist (guildid, userid, by, reason) VALUES ($1, $2, $3, $4)', [message.guild.id, member.id, `${message.author.tag} (${message.author.id})`, reason]);
  return message.reply(`Successfully blacklisted ${member.user.tag} for \`${Client.escMD(reason)}\`.`);
};

module.exports.help = {
  name: 'blacklist',
  desc: 'Blacklists a member from using the bot.',
  category: 'moderation',
  usage: '?blacklist <Member> [Reason]',
  aliases: []
};
