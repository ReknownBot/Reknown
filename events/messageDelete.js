/**
 * @param {import('../structures/client.js')} Client
 * @param {import('discord.js').Message} message
 */
async function logMessage(Client, message) {
  const embed = new Client.Discord.MessageEmbed()
    .setTitle('Message Deleted')
    .addField('Channel', message.channel)
    .setColor(0xFF0000)
    .setTimestamp();

  if (!message.content && message.embeds[0]) return;
  else if (message.attachments.first() && message.attachments.first().width) embed.setImage(message.attachments.first().proxyURL);

  if (message.content) embed.addField('Content', message.content);
  else if (!embed.image) return;

  if (message.guild.me.hasPermission('VIEW_AUDIT_LOG')) {
    const entry = (await message.guild.fetchAuditLogs({
      type: 'MESSAGE_DELETE',
      limit: 1
    })).entries.first();

    if (entry) {
      const executor = entry.executor;
      const reason = entry.reason || 'None';

      if (Date.now() - entry.createdTimestamp < 7000) embed.setAuthor(`${executor.tag} (${executor.id})`, executor.displayAvatarURL()).addField('Author', message.author, true);
      else embed.setAuthor(`${message.author.tag} (${message.author.id})`, message.author.displayAvatarURL());

      embed.addField('Reason', reason, true);
    }
  }

  return Client.functions.get('sendlog')(Client, embed, message.guild.id);
}

/**
 * @param {import('../structures/client.js').} Client
 * @param {import('discord.js').Message} message
 */
async function delStar (Client, message) {
  const msgRow = (await Client.sql.query('SELECT * FROM star WHERE msgid = $1', [message.id])).rows[0];
  const toggled = (await Client.sql.query('SELECT bool FROM togglestar WHERE guildid = $1 AND bool = $2', [message.guild.id, 1])).rows[0];
  const cid = (await Client.sql.query('SELECT channelid FROM starchannel WHERE guildid = $1', [message.guild.id])).rows[0];
  const sChannel = message.guild.channels.get(cid ? cid.channelid : null) || message.guild.channels.find(c => c.name === 'starboard');

  if (msgRow && toggled) {
    Client.sql.query('DELETE FROM star WHERE msgid = $1', [message.id]);
    if (sChannel && Client.checkClientPerms(sChannel, 'VIEW_CHANNEL')) {
      const msg = await sChannel.messages.fetch(msgRow.editid);
      if (msg && !msg.deleted) return msg.delete();
    }
  }
}

/**
 * @param {import('../structures/client.js')} Client
 */
module.exports = (Client) => {
  return Client.bot.on('messageDelete', message => {
    if (message.partial) return;
    if (!message.guild || !message.guild.available) return;
    if (message.author.bot) return;

    logMessage(Client, message);
    delStar(Client, message);
  });
};
