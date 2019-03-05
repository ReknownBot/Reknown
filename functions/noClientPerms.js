module.exports = (message, perms, channel) => {
  if (channel) {
    if (message.channel === channel) return message.reply(`I am missing permission in this channel.\n\n\`${perms.join('\n')}\``);
    return message.reply(`I am missing permissions in ${channel.type === 'text' ? channel : channel.name}.\n\n\`${perms.join('\n')}\``);
  } else return message.reply(`I am missing permissions.\n\n\`${perms.join('\n')}\``);
};
