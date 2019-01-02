module.exports = async (Client, member) => {
  const registered = (await Client.sql.query('SELECT money FROM economy WHERE userid = $1', [member.id])).rows[0];
  if (!registered) return;

  return Client.sql.query('UPDATE economy SET money = money + 1 WHERE userid = $1', [member.id]);
};
