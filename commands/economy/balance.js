module.exports = async (Client, message, args) => {
  const member = args[1] ? Client.getObj(args[1], { guild: message.guild, type: 'member' }) : message.member;
  if (!member) return message.reply('The member you provided is invalid!');

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
