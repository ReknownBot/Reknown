/**
 * @param {import('../../structures/client.js')} Client
 * @param {import('discord.js').Message} message
 * @param {String[]} args
*/
module.exports = async (Client, message, args) => {
  const prefixRow = (await Client.sql.query('SELECT customprefix FROM prefix WHERE guildid = $1 LIMIT 1', [message.guild.id])).rows[0];
  const prefix = prefixRow ? prefixRow.customprefix : '?';
  return message.channel.send(`The current prefix on this server is \`${Client.escMD(prefix)}\`. Looking to change the prefix? Take a look at \`${prefix}config prefix <New Prefix>\`.`);
};

module.exports.help = {
  name: 'prefix',
  desc: 'Displays the current prefix for the server.',
  category: 'misc',
  usage: '?prefix',
  aliases: []
};
