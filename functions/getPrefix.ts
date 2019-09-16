import ReknownClient from '../structures/client';
import { Snowflake } from 'discord.js';
import { PrefixRow } from 'ReknownBot';

module.exports = async (client: ReknownClient, id: Snowflake): Promise<string> => {
  const row: PrefixRow = (await client.query('SELECT customprefix FROM prefix WHERE guildid = $1', [ id ])).rows[0];
  return row ? row.customprefix : client.config.prefix;
};
