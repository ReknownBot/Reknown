/**
 * @param {import('../structures/client.js')} Client
 * @param {import('discord.js').GuildMember} member
 */
async function goodbyeMessage(Client, member) {
  const guild = member.guild;

  const { bool: enabled } = (await Client.sql.query('SELECT bool FROM togglewelcome WHERE guildid = $1 LIMIT 1', [guild.id])).rows[0] || {};
  if (!enabled) return;

  const cRow = (await Client.sql.query('SELECT channel FROM welcomechannel WHERE guildid = $1 LIMIT 1', [guild.id])).rows[0];
  const channelid = cRow ? cRow.channel : 'default';

  const channel = channelid === 'default' ? guild.channels.find(c => c.position === 0 && c.type === 'text') : guild.channels.get(channelid);
  if (!channel) return;
  if (!Client.checkClientPerms(channel, 'EMBED_LINKS', 'SEND_MESSAGES')) return;

  const msgRow = (await Client.sql.query('SELECT custommessage FROM goodbyemessages WHERE guildid = $1', [guild.id])).rows[0];
  const msg = msgRow ? msgRow.custommessage
    .replace('<Guild>', guild.name)
    .replace('<User>', member.toString())
    .replace('<MemberCount>', guild.memberCount)
    : `${member} left **${member.guild.name}**. There are ${member.guild.memberCount} members now.`;

  const embed = new Client.Discord.MessageEmbed()
    .setDescription(msg)
    .setColor(0xFF0000)
    .setTimestamp();

  return channel.send(embed);
}

/**
 * @param {import('../structures/client.js')} Client
 * @param {import('discord.js').GuildMember} member
 */
function logMessage (Client, member) {
  const embed = new Client.Discord.MessageEmbed()
    .setTitle('Member Left')
    .setColor(0xff9400)
    .setTimestamp()
    .setThumbnail(member.user.displayAvatarURL({ size: 2048 }))
    .setDescription(`**${member.user.tag}** (${member.user.id})`);
  return Client.functions.get('sendlog')(Client, embed, member.guild.id);
}

/**
 * @param {import('../structures/client.js')} Client
 * @param {import('discord.js').GuildAuditLogsEntry} entry
 * @param {import('discord.js').GuildMember} member
 */
function kickMessage (Client, entry, member) {
  const embed = new Client.Discord.MessageEmbed()
    .setTitle('Member Kicked')
    .setColor(0xFF0000)
    .setTimestamp()
    .setThumbnail(member.user.displayAvatarURL({ size: 2048 }))
    .addField('Member', `${member.user.tag} - ${member.user.id}`, true)
    .setAuthor(`${entry.executor.tag} (${entry.executor.id})`, entry.executor.displayAvatarURL());
  if (entry.reason) embed.addField('Reason', entry.reason, true);

  return Client.functions.get('sendlog')(Client, embed, member.guild.id);
}

/**
 * @param {import('../structures/client.js')} Client
 */
module.exports = (Client) => {
  return Client.bot.on('guildMemberRemove', async member => {
    if (!member.guild.me) return;
    if (!member.guild || !member.guild.available) return;

    goodbyeMessage(Client, member);

    if (!member.guild.me.hasPermission('VIEW_AUDIT_LOG')) return logMessage(Client, member);
    else {
      const entry = (await member.guild.fetchAuditLogs({ type: 20, limit: 1 })).entries.first();
      if (!entry) return logMessage(Client, member);
      if (Date.now() - entry.createdTimestamp > 5000) return logMessage(Client, member);

      return kickMessage(Client, entry, member);
    }
  });
};
