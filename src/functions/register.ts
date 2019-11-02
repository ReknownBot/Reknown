import { ReknownClient } from "ReknownBot";
import { Snowflake } from "discord.js";
import { tables } from '../Constants';

export async function run (client: ReknownClient, userid: Snowflake) {
  return (await client.query(`INSERT INTO ${tables.ECONOMY} (balance, userid) VALUES ($1, $2) RETURNING *`, [ 0, userid ])).rows[0];
}
