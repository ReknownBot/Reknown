module.exports = async (Client, member) => {
  const bRow = (await Client.sql.query('SELECT by, reason FROM blacklist WHERE userid = $1 AND guildid = $2', [member.id, member.guild.id])).rows[0];
  if (!bRow) return false;
  const msgEnabled = (await Client.sql.query('SELECT bool FROM blacklistmsg WHERE guildid = $1', [member.guild.id])).rows[0];
  if (msgEnabled && !msgEnabled.bool) return 'disabled';
  return {
    by: bRow.by,
    reason: bRow.reason
  };
};
