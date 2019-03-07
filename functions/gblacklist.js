/**
 * @param {import('../structures/client.js')} Client
 * @param {import('discord.js').GuildMember} member
 */
module.exports = async (Client, member) => {
  const bRow = (await Client.sql.query('SELECT reason FROM gblacklist WHERE memberid = $1', [member.id])).rows[0];
  if (!bRow) return false;
  return bRow.reason;
};
