import { ReknownClient } from 'ReknownBot';

module.exports = async (client: ReknownClient, table: string, changes: { [ column: string ]: any }, filters: { [ column: string ]: any }) => {
  const columns = Object.keys(changes);
  const values = Object.values(changes);
  const row = (await client.query(`SELECT * FROM ${table} WHERE ${Object.keys(filters).map((c, i) => `${c} = $${i + 1}`).join(' AND ')}`, Object.values(filters))).rows[0];
  if (row) client.query(`UPDATE ${table} SET ${columns.map((c, i) => `${c} = $${i + 1}`)} WHERE ${Object.keys(filters).map((c, i) => `${c} = $${i + columns.length + 1}`).join(' AND ')}`, [ ...values, ...Object.values(filters) ]);
  else client.query(`INSERT INTO ${table} (${columns}) VALUES (${columns.map((c, i) => `$${i + 1}`)})`, values);
};
