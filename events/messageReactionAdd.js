/**
 * @param {import('../structures/client.js')} Client
 */
module.exports = Client => {
  return Client.bot.on('messageReactionAdd', async (reaction, user) => {
    if (user.partial) await user.fetch();
    if (reaction.message.partial) await reaction.message.fetch();
    const message = reaction.message;
    if (!message.guild || !message.guild.available) return;
    if (message.webhookID) return;
    if (!message.content && !message.attachments.find(attch => attch.height)) return;

    if (message.author.partial) await message.author.fetch();

    const channel = message.channel;
    if (!Client.checkClientPerms(channel, 'VIEW_CHANNEL', 'SEND_MESSAGES')) return;
    const emoji = reaction.emoji.name;
    if (emoji !== '⭐') return;

    const toggled = (await Client.sql.query('SELECT bool FROM togglestar WHERE guildid = $1 AND bool = $2', [message.guild.id, 1])).rows[0];
    if (!toggled) return;

    if (user.bot) return;
    if (user.id === message.author.id) return channel.send(`${user}, You cannot star your own messages.`).catch(() => {});

    const channelRow = (await Client.sql.query('SELECT channelid FROM starchannel WHERE guildid = $1', [message.guild.id])).rows[0];
    const msgRow = (await Client.sql.query('SELECT editid FROM star WHERE msgid = $1', [message.id])).rows[0];
    const sChannel = channelRow ? message.guild.channels.get(channelRow.channelid) : message.guild.channels.find(chan => chan.name === 'starboard' && chan.type === 'text');
    if (!sChannel) return;

    if (!Client.checkClientPerms(sChannel, 'VIEW_CHANNEL', 'SEND_MESSAGES', 'EMBED_LINKS')) return;

    const embed = new Client.Discord.MessageEmbed()
      .addField('Author', message.author, true)
      .addField('Channel', channel, true)
      .addField('Direct Link', `[Click](${message.url})`)
      .setColor(0xffd000)
      .setTimestamp();

    if (message.content) embed.setDescription(message.content);

    const img = message.attachments.find(attch => attch.height);
    if (img) embed.setImage(img.proxyURL);

    await reaction.users.fetch();
    let reactionCount = reaction.count;
    if (reaction.users.has(message.author.id)) reactionCount -= 1;
    embed.setFooter(`⭐${Client.formatNum(reactionCount)} | ID: ${message.id}`);

    if (reactionCount === 0) return Client.sql.query('DELETE FROM star WHERE msgid = $1', message.id);

    if (!msgRow) {
      if (reactionCount === 0) return;
      const msg = await sChannel.send(embed);
      Client.sql.query('INSERT INTO star (msgid, editid) VALUES ($1, $2)', [message.id, msg.id]);
    } else {
      const sMessage = await sChannel.messages.fetch(msgRow.editid).catch(() => null);

      if (sMessage && !sMessage.deleted) sMessage.edit(embed);
      else {
        const msg = await sChannel.send(embed);
        Client.sql.query('UPDATE star SET editid = $1', [msg.id]);
      }
    }
  });
};
