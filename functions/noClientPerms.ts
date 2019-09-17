import { GuildChannel, Message } from 'discord.js';

module.exports = (message: Message, perms: string[], channel?: GuildChannel): void => {
  const formatted = perms.map(p => `\`${p}\``).join('\n');
  if (channel) return void message.channel.send(`I do not have the required permissions in ${channel.type === 'text' ? channel : `**${channel.name}`}.\nThe permissions are:\n\n${formatted}`);
  message.channel.send(`I do not have the required permissions.\nThe permissions are:\n\n${formatted}`);
};
