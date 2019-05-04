/**
 * @param {import('../structures/client.js')} Client
 * @param {import('discord.js').Message} oldMessage
 * @param {import('discord.js').Message} newMessage
 */
function logMessage(Client, oldMessage, newMessage) {
  if (!oldMessage.content && !newMessage.content) return;
  if (oldMessage.content === newMessage.content) return;
  if (oldMessage.content.length > 1024 && newMessage.content.length > 1024) return;

  const embed = new Client.Discord.MessageEmbed()
    .setTitle('Message Edited')
    .setAuthor(`${oldMessage.author.tag} (${oldMessage.author.id})`, oldMessage.author.displayAvatarURL())
    .addField('Previous', oldMessage.content ? oldMessage.content.length > 1024 ? 'Over 1024 Char.' : oldMessage.content : 'None')
    .addField('After', newMessage.content ? newMessage.content.length > 1024 ? 'Over 1024 Char.' : newMessage.content : 'None')
    .addField('Channel', oldMessage.channel)
    .setColor(0x00FFFF)
    .setTimestamp();

  return Client.functions.get('sendlog')(Client, embed, oldMessage.guild.id);
}

/**
 * @param {import('../structures/client.js')} Client
 * @param {import('discord.js').Message} newMessage
 */
function editMsg (Client, newMessage) {
  return Client.bot.emit('message', newMessage);
}

/**
 * @param {import('../structures/client.js')} Client
 * @param {import('discord.js').Message} newMessage
 */
async function editStar (Client, newMessage) {
  if (newMessage.content || newMessage.attachments.size > 0) {
    const toggled = (await Client.sql.query('SELECT bool FROM togglestar WHERE guildid = $1 AND bool = $2', [newMessage.guild.id, 1])).rows[0];
    const cid = (await Client.sql.query('SELECT channelid FROM starchannel WHERE guildid = $1', [newMessage.guild.id])).rows[0];
    const msgRow = (await Client.sql.query('SELECT editid FROM star WHERE msgid = $1', [newMessage.id])).rows[0];
    if (toggled && msgRow) {
      const sChannel = newMessage.guild.channels.get(cid ? cid.channelid : null) || newMessage.guild.channels.find(c => c.name === 'starboard');
      if (!sChannel) return;

      const msg = await sChannel.messages.fetch(msgRow.editid);
      if (!msg) return;

      const embed = msg.embeds[0];
      if (newMessage.content) embed.setDescription(newMessage.content);
      const img = newMessage.attachments.find(attch => attch.height);
      if (img) embed.setImage(img.proxyURL);
      return msg.edit(embed);
    } else Client.sql.query('DELETE FROM star WHERE msgid = $1', [newMessage.id]);
  }
}

/**
 * @param {import('../structures/client.js')} Client
 */
module.exports = (Client) => {
  return Client.bot.on('messageUpdate', async (oldMessage, newMessage) => {
    if (oldMessage.partial || newMessage.partial) return;
    if (!oldMessage.guild || !oldMessage.guild.available) return;
    if (newMessage.member.partial) await newMessage.member.fetch();
    if (newMessage.author.partial) await newMessage.author.fetch();

    logMessage(Client, oldMessage, newMessage);
    editMsg(Client, newMessage);
    editStar(Client, newMessage);
  });
};
