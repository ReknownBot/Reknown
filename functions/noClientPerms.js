module.exports.run = (message, channel, perms) => {
  return message.channel.send(`I do not have the required permissions in ${channel.type === 'text' ? channel : `**${channel.name}`}.\nThe permissions are:\n\n${perms.map(p => `\`${p}\``).join('\n')}`);
};
