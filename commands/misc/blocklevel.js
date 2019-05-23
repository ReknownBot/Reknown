/**
 * @param {import('../../structures/client.js')} Client
 * @param {import('discord.js').Message} message
 * @param {String[]} args
 */
module.exports = async (Client, message, args) => {
  if (!await Client.checkPerms('block', 'level', message.member)) return Client.functions.get('noCustomPerm')(message, 'level.block');
  if (!args[1]) return Client.functions.get('argMissing')(message.channel, 1, 'a text channel to block levelling in');
  /** @type {import('discord.js').TextChannel} */
  const channel = Client.getObj(args[1], { guild: message.guild, type: 'channel', filter: 'text' });
  if (!channel) return Client.functions.get('argFix')(Client, message.channel, 1, 'Did not find a text channel with that query.');

  const row = (await Client.sql.query('SELECT * FROM levelblock WHERE channelid = $1', [channel.id])).rows[0];
  let toggle;
  if (!args[2]) {
    if (!row) toggle = true;
    else toggle = !row.bool;
  } else if (args[2]) {
    if (!['on', 'off'].includes(args[2].toLowerCase())) return Client.functions.get('argFix')(Client, message.channel, 2, 'Must be "On" or "Off".');
    toggle = args[2].toLowerCase() === 'on';
  }

  if (!row) Client.sql.query('INSERT INTO levelblock (guildid, channelid, bool) VALUES ($1, $2, $3)', [message.guild.id, channel.id, toggle ? 1 : 0]);
  else Client.sql.query('UPDATE levelblock SET bool = $1 WHERE channelid = $2', [toggle ? 1 : 0, channel.id]);

  return message.channel.send(`Successfully ${toggle ? 'blocked' : 'allowed'} levelling up in ${channel}.`);
};

module.exports.help = {
  name: 'blocklevel',
  desc: 'Blocks levelling up in a channel.',
  category: 'misc',
  usage: '?blocklevel <Channel> [On/Off]',
  aliases: []
};
