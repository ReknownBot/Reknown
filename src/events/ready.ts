import { AutoPoster } from 'topgg-autoposter';
import type ColumnTypes from '../typings/ColumnTypes';
import type { EmoteName } from '../structures/Client';
import type ReknownClient from '../structures/Client';
import ms from 'ms';
import { tables } from '../Constants';
import { Permissions, Snowflake } from 'discord.js';

function initDBL (client: ReknownClient) {
  if (client.user!.id === client.config.officialClient) {
    AutoPoster(process.env.DBL_API_KEY!, client);
  }
}

function invalidateGuild (arr: Snowflake[], client: ReknownClient, guildid: Snowflake) {
  arr.push(guildid);
  client.sql`DELETE FROM ${client.sql(tables.MUTES)} WHERE guildid = ${guildid}`;
}

async function muteCheck (client: ReknownClient) {
  const rows = await client.sql<ColumnTypes['MUTES'][]>`SELECT * FROM ${client.sql(tables.MUTES)}`;

  const invalidGuilds: Snowflake[] = [];
  rows.forEach(async row => {
    if (invalidGuilds.includes(row.guildid)) return;

    const guild = client.guilds.cache.get(row.guildid);
    if (!guild) return invalidateGuild(invalidGuilds, client, row.guildid);
    if (!guild.me!.permissions.has(Permissions.FLAGS.MANAGE_ROLES)) return invalidateGuild(invalidGuilds, client, guild.id);
    const role = await client.functions.getMuteRole(client, guild);
    if (!role) return invalidateGuild(invalidGuilds, client, guild.id);

    const member = await guild.members.fetch(row.userid).catch(() => null);
    if (!member) return client.sql`DELETE FROM ${client.sql(tables.MUTES)} WHERE guildid = ${row.guildid}`;
    if (!member.roles.cache.has(role.id)) return client.sql`DELETE FROM ${client.sql(tables.MUTES)} WHERE guildid = ${row.guildid}`;

    const duration = Number(row.endsat) - Date.now();
    if (Number(row.endsat) <= Date.now()) {
      member.roles.remove(role);
      client.sql`DELETE FROM ${client.sql(tables.MUTES)} WHERE guildid = ${row.guildid}`;
    } else if (duration < ms('20d')) client.mutes.set(member.id, setTimeout(client.functions.unmute.bind(client.functions), duration, client, member));
  });
}

export async function run (client: ReknownClient) {
  console.log(`Successfully logged in as ${client.user!.tag} (${client.user!.id}).`);

  for (const emoji in client.config.emojis) {
    if (Object.prototype.hasOwnProperty.call(client.config.emojis, emoji)) {
      client.emotes.set(emoji as EmoteName, client.emojis.cache.get(client.config.emojis[emoji])!);
    }
  }

  initDBL(client);
  muteCheck(client);
}
