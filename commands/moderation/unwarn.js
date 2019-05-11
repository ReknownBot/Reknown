/**
 * @param {import('../../structures/client.js')} Client
 * @param {import('discord.js').Message} message
 * @param {String[]} args
*/
module.exports = async (Client, message, args) => {
  if (!await Client.checkPerms('unwarn', 'mod', message.member)) return Client.functions.get('noCustomPerm')(message, 'mod.unwarn');

  if (!args[1]) return Client.functions.get('argMissing')(message.channel, 1, 'a member to unwarn');
  const member = await Client.getObj(args[1], { guild: message.guild, type: 'member' });
  if (!member) return Client.functions.get('argFix')(Client, message.channel, 1, 'Did not find a member with that query.');

  const warnid = args[2];
  if (!args[2]) return Client.functions.get('argMissing')(message.channel, 2, `a warn ID. Use ${Client.prefixes[message.guild.id]}warnings @${member.user.tag} to view their warn IDs.`);
  if (isNaN(warnid)) return Client.functions.get('argFix')(Client, message.channel, 2, 'The warning ID must be a number.');
  if (warnid < 1) return Client.functions.get('argFix')(Client, message.channel, 2, 'The warning ID may not be lower than 1.');

  const row = (await Client.sql.query('SELECT * FROM warnings WHERE userid = $1 AND warnid = $2 AND guildid = $3', [member.id, warnid, message.guild.id])).rows[0];
  if (!row) return Client.functions.get('argFix')(Client, message.channel, 2, 'The warning ID is incorrect.');

  Client.sql.query('DELETE FROM warnings WHERE userid = $1 AND warnid = $2 AND guildid = $3', [member.id, warnid, message.guild.id]);
  return message.channel.send(`Successfully deleted a warning from ${member.user.tag} by the warn ID of **${warnid}**.`);
};

module.exports.help = {
  name: 'unwarn',
  desc: 'Removes a warning from a user.',
  category: 'moderation',
  usage: '?unwarn <Member> <Warn ID>',
  aliases: ['deletewarn', 'dwarn']
};
