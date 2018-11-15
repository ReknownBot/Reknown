const allowedEvents = ['MESSAGE_REACTION_ADD', 'MESSAGE_REACTION_REMOVE', 'MESSAGE_REACTION_REMOVE_ALL'];

module.exports = async (Client, data) => {
  const { t: event } = data;
  if (!allowedEvents.includes(event)) return;

  data = data.d;
  const channel = Client.bot.channels.get(data.channel_id);
  if (!Client.checkClientPerms(channel, 'VIEW_CHANNEL', 'SEND_MESSAGES')) return;

  if (event === allowedEvents[0] || event === allowedEvents[1]) {
    let message;
    try {
      message = await channel.messages.fetch(data.message_id);
    } catch (e) {
      if (e != 'DiscordAPIError: Unknown Message') {
        throw new Error(e);
      } else return;
    }
    if (!message.content && message.attachments.size === 0) return;

    const toggled = await Client.sql.query('SELECT bool FROM togglestar WHERE guildid = $1 AND bool = $2', [message.guild.id, 1]);
    if (!toggled.rows[0]) return;

    const { emoji } = data;
    if (channel.type !== 'text') return;
    if (emoji.name !== '⭐') return;

    const member = message.guild.members.get(data.user_id);
    if (member.user.bot) return;
    if (member.id === message.author.id) {
      // eslint-disable-next-line
      if (event === 'MESSAGE_REACTION_ADD') channel.send(`${member}, You cannot star your own messages.`).then(m => m.delete({ timeout: 5000 })).catch(e => {
        if (e != 'DiscordAPIError: Unknown Message') throw new Error(e);
      });
      return;
    }

    const cid = (await Client.sql.query('SELECT channelid FROM starchannel WHERE guildid = $1', [message.guild.id])).rows[0];
    const msgRow = (await Client.sql.query('SELECT editid FROM star WHERE msgid = $1', [message.id])).rows[0];

    const sChannel = message.guild.channels.get(cid ? cid.channelid : null) || message.guild.channels.find(c => c.name === 'starboard');
    if (!sChannel) return;

    if (!Client.checkClientPerms(sChannel, 'VIEW_CHANNEL', 'SEND_MESSAGES', 'EMBED_LINKS', 'ADD_REACTIONS')) return;

    const embed = new Client.Discord.MessageEmbed()
      .addField('Author', message.author, true)
      .addField('Channel', channel, true)
      .addField('Direct Link', `[Click](${message.url})`)
      .setColor(0xffd000)
      .setTimestamp();

    if (message.content) embed.setDescription(message.content);

    const img = message.attachments.find(attch => attch.height);
    if (img) embed.setImage(img.proxyURL);

    let reactionCount = message.reactions.get('⭐') ? message.reactions.get('⭐').count : 0;
    if (reactionCount > 0 && message.reactions.get('⭐').users.has(message.author.id)) reactionCount -= 1;

    embed.setFooter(`⭐${reactionCount} | ID: ${message.id}`);

    if (!msgRow) {
      const msg = await sChannel.send(embed);
      Client.sql.query('INSERT INTO star (msgid, editid) VALUES ($1, $2)', [message.id, msg.id]);
    } else {
      let sMessage;
      try {
        sMessage = await sChannel.messages.fetch(msgRow.editid);
      } catch (e) {
        sMessage = null;
      }

      if (sMessage && !sMessage.deleted) {
        if (reactionCount === 0) sMessage.delete();
        else sMessage.edit(embed);
      } else {
        if (reactionCount !== 0) {
          const msg = await sChannel.send(embed);
          Client.sql.query('UPDATE star SET editid = $1', [msg.id]);
        }
      }
    }
  } else if (event === allowedEvents[2]) {
    const message = await channel.messages.fetch(data.message_id);
    if (channel.type !== 'text') return;

    const toggled = (await Client.sql.query('SELECT bool FROM togglestar WHERE guildid = $1 AND bool = $2', [message.guild.id, 1])).rows[0];
    if (!toggled) return;

    const cid = (await Client.sql.query('SELECT channelid FROM starchannel WHERE guildid = $1', [message.guild.id])).rows[0];
    const msgRow = (await Client.sql.query('SELECT * FROM star WHERE msgid = $1', [message.id])).rows[0];

    const sChannel = message.guild.channels.get(cid ? cid.channelid : null) || message.guild.channels.find(c => c.name === 'starboard');
    Client.sql.query('DELETE FROM star WHERE msgid = $1', [message.id]);
    if (!sChannel) return;

    if (!Client.checkClientPerms(sChannel, 'VIEW_CHANNEL')) return;
    if (!msgRow) return;
    const sMessage = await sChannel.messages.fetch(msgRow.editid);
    if (sMessage && !sMessage.deleted) sMessage.delete();
  }
};
