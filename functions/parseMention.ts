import { Snowflake, Guild, GuildChannel, Role, GuildMember, User } from 'discord.js';
import ReknownClient from '../structures/client';

const regexArr = [ /<@!?(\d{17,19})>/, /<@&(\d{17,19})>/, /<#(\d{17,19})>/ ];

interface Options {
  client: ReknownClient;
  cType: 'text' | 'voice' | 'category';
  type: 'member' | 'user' | 'role' | 'channel';
}

module.exports = (id: Snowflake, guild: Guild, options: Options): Promise<GuildMember> | Promise<User> | Role | GuildChannel | Promise<false | GuildMember | User> | null | false => {
  if (isNaN(id as unknown as number) && !regexArr.some(regex => regex.test(id))) return Promise.reject(false);

  let parsedId: string;
  if (isNaN(id as unknown as number)) {
    parsedId = id.slice(2, -1);
    if (id.startsWith('<@!') || id.startsWith('<@&')) parsedId = id.slice(3, -1);
  } else parsedId = id;
  const cType = options.cType || 'text';

  switch (options.type) {
    case 'member': return guild.members.fetch(parsedId);
    case 'user': return options.client.users.fetch(parsedId);
    case 'role': return guild.roles.get(parsedId) || false;
    case 'channel': return guild.channels.find(c => c.id === parsedId && c.type === cType) || false;
    default: return null;
  }
};
