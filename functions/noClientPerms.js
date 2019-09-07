module.exports = (message, perms, channel) => {
  perms = perms.map(p => `\`${p}\``).join('\n');
  if (channel) return message.channel.send(`I do not have the required permissions in ${channel.type === 'text' ? channel : `**${channel.name}`}.\nThe permissions are:\n\n${perms}`);
  return message.channel.send(`I do not have the required permissions.\nThe permissions are:\n\n${perms}`);
};
