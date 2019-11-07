import ReknownClient from '../structures/client';

export async function run (client: ReknownClient, table: string, changes: { [ column: string ]: any }, filters: { [ column: string ]: any }) {
  const columns = Object.keys(changes);
  const values = Object.values(changes);
  if (table === 'prefix') client.prefixes[changes.guildid] = changes.customprefix;
  const row = await client.functions.getRow<any>(client, table, filters);
  if (row) client.query(`UPDATE ${table} SET ${columns.map((c, i) => `${c} = $${i + 1}`)} WHERE ${Object.keys(filters).map((c, i) => `${c} = $${i + columns.length + 1}`).join(' AND ')}`, [ ...values, ...Object.values(filters) ]);
  else client.query(`INSERT INTO ${table} (${columns}) VALUES (${columns.map((c, i) => `$${i + 1}`)})`, values);
}