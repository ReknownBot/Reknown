import { ReknownClient } from 'ReknownBot';

export async function run (client: ReknownClient, table: string, filters: { [ rowName: string ]: any }) {
  const query = `SELECT * FROM ${table} WHERE ${Object.keys(filters).map((rowName, i) => `${rowName} = $${i + 1}`).join(' AND ')}`;
  const { rows } = await client.query(query, Object.values(filters));
  return rows ? rows[0] : null;
}
