module.exports.run = async (client, id) => {
  const row = (await client.query('SELECT customprefix FROM prefix WHERE guildid = $1', [ id ])).rows[0];
  return row ? row.customprefix : client.config.prefix;
};
