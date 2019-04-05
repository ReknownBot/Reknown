/**
 * @param {import('../structures/client.js')} Client
 * @param {String[]} perms
 * @param {import('discord.js').GuildChannel} channel
 */
module.exports = (message, perms, channel) => {
  if (channel) {
    if (message.channel === channel) return message.reply(`I am missing permissions in this channel.\n\n\`${perms.join('\n')}\``);
    return message.reply(`I am missing permissions in ${channel.type === 'text' ? channel : channel.name}.\n\n\`${perms.join('\n')}\``);
  } else return message.reply(`I am missing permissions.\n\n\`${perms.join('\n')}\``);
};
