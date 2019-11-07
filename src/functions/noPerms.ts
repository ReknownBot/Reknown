import { GuildChannel, Message, Util } from 'discord.js';

export function run (message: Message, perms: string[], channel?: GuildChannel) {
  const formatted = perms.map(p => `\`${p}\``).join('\n');
  if (channel) return message.channel.send(`You do not have the required permissions in ${channel.type === 'text' ? channel : `**${Util.escapeMarkdown(channel.name)}**`}.\nThe permissions are:\n\n${formatted}`);
  message.channel.send(`You do not have the required permissions.\nThe permissions are:\n\n${formatted}`);
}