/**
 * @param {import('../../structures/client.js')} Client
 * @param {import('discord.js').Message} message
 * @param {String[]} args
 */
module.exports = async (Client, message, args) => {
  /** @type {import('discord.js').GuildMember} */
  const member = args[1] ? await Client.getObj(args[1], { guild: message.guild, type: 'member' }) : message.member;
  if (!member) return Client.functions.get('argFix')(Client, message.channel, 1, 'Did not find the member provided.');

  const row = (await Client.sql.query('SELECT money FROM economy WHERE userid = $1', [member.id])).rows[0];
  if (!row) return message.reply(`${message.member === member ? 'You are' : 'That member is'} not registered! Use \`${Client.escMD(Client.prefixes[message.guild.id])}register\` to do so.`);

  return message.channel.send(`${message.member === member ? 'You have' : `${member.user.tag} has`} **${row.money}** Credits.`);
};

module.exports.help = {
  name: 'balance',
  desc: 'Shows your balance.',
  category: 'economy',
  usage: '?balance [Member]',
  aliases: ['bal', 'money']
};
