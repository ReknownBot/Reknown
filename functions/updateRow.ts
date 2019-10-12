import { ReknownClient } from 'ReknownBot';

module.exports = async (client: ReknownClient, table: string, changes: { [ column: string ]: any }, filters: { [ column: string ]: any }) => {
  const columns = Object.keys(changes);
  const values = Object.values(changes);
  const fColumns = Object.keys(filters);
  const fValues = Object.values(filters);
  const row = (await client.query(`SELECT * FROM ${table}`)).rows[0];
  if (row) client.query(`UPDATE ${table} SET ${columns.map((c, i) => `${c} = $${i + 1}`).join(', ')} WHERE ${fColumns.map((c, i) => `${c} = $${i + columns.length + 1}`).join(' AND ')}`, [ ...values, ...fValues ]);
  else client.query(`INSERT INTO ${table} (${columns.join(', ')}) VALUES (${columns.map((c, i) => `$${i + 1}`)})`, values);
};
