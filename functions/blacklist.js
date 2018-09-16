module.exports = async (Client, member) => {
  const bRow = (await Client.sql.query('SELECT by, reason FROM blacklist WHERE userid = $1 AND guildid = $2', [member.id, member.guild.id])).rows[0];
  if (!bRow) return false;
  return {
    by: bRow.by,
    reason: bRow.reason
  };
};
