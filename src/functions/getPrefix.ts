import ReknownClient from '../structures/client';
import { Snowflake } from 'discord.js';
import { tables } from '../Constants';

export async function run (client: ReknownClient, id: Snowflake): Promise<string> {
  if (client.prefixes[id]) return client.prefixes[id];
  const row = await client.functions.getRow(client, tables.PREFIX, {
    guildid: id
  });
  return client.prefixes[id] = row ? row.customprefix : client.config.prefix;
}
