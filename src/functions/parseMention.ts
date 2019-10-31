import { ParseMentionOptions } from 'ReknownBot';
import { Snowflake } from 'discord.js';

const regexArr = [ /<@!?(\d{17,19})>/, /<@&(\d{17,19})>/, /<#(\d{17,19})>/ ];

export function run (id: Snowflake, options: ParseMentionOptions) {
  if (!parseInt(id) && !regexArr.some(regex => regex.test(id))) {
    if ([ 'member', 'user' ].includes(options.type)) return Promise.reject(null);
    return null;
  }

  let parsedId: string;
  if (!parseInt(id)) {
    parsedId = id.slice(2, -1);
    if (id.startsWith('<@!') || id.startsWith('<@&')) parsedId = id.slice(3, -1);
  } else parsedId = id;
  const cType = options.cType || 'text';

  switch (options.type) {
    case 'member': return options.guild!.members.fetch(parsedId);
    case 'user': return options.client!.users.fetch(parsedId);
    case 'role': return options.guild!.roles.get(parsedId);
    case 'channel': return options.guild!.channels.find(c => c.id === parsedId && c.type === cType);
    default: return false;
  }
}
