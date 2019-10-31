import ReknownClient from '../structures/client';
import { Snowflake } from 'discord.js';

export async function run (client: ReknownClient, id: Snowflake): Promise<string> {
  if (client.prefixes[id]) return client.prefixes[id];
  const row = (await client.query('SELECT customprefix FROM prefix WHERE guildid = $1', [ id ])).rows[0];
  return client.prefixes[id] = row ? row.customprefix : client.config.prefix;
}
