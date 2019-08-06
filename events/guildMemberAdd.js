function sendLog (client, member) {
  const embed = new client.Discord.MessageEmbed()
    .addField('Created at', client.dateformat(member.user.createdAt, 'mmmm d, yyyy @ HH:MM:ss UTC'))
    .setColor(client.config.embedColor)
    .setFooter(`ID: ${member.id}`)
    .setTimestamp()
    .setTitle('Member Joined');

  return client.functions.sendLog.run(client, embed, member.guild);
}

async function welcomeMsg (client, member) {
  const toggledRow = (await client.query('SELECT bool FROM togglewelcome WHERE guildid = $1', [ member.guild.id ])).rows[0];
  if (!toggledRow || !toggledRow.bool) return;

  const channelRow = (await client.query('SELECT channel FROM welcomechannel WHERE guildid = $1', [ member.guild.id ])).rows[0];
  const channel = channelRow ? member.guild.channels.get(channelRow.channel) : member.guild.channels.find(c => c.name === 'action-log' && c.type === 'text');
  if (!channel) return;
  if (!channel.permissionsFor(client.user).has([ 'VIEW_CHANNEL', 'SEND_MESSAGES', 'EMBED_LINKS' ])) return;

  const msgRow = (await client.query('SELECT msg FROM welcomemsg WHERE guildid = $1', [ member.guild.id ])).rows[0];
  const msg = msgRow ? msgRow.msg : '<User>, Welcome to **<Server>**! There are <MemberCount> members now.';

  const embed = new client.Discord.MessageEmbed()
    .setColor(client.config.embedColor)
    .setDescription(msg.replace(/<MemberCount>/g, member.guild.memberCount).replace(/<Server>/g, member.guild.name).replace(/<User>/g, member.toString()))
    .setFooter(`ID: ${member.id}`)
    .setTimestamp();
  return channel.send(embed);
}

module.exports.run = (client, member) => {
  if (!member.guild.available) return;
  if (member.id === client.user.id) return;

  sendLog(client, member);
  welcomeMsg(client, member);
};
