import { Node } from 'lavalink';
import type ReknownClient from '../structures/client';
import type { Snowflake } from 'discord.js';
import ms from 'ms';
import { tables } from '../Constants';
import type { EmoteName, RowMutes } from 'ReknownBot';

function invalidateGuild (arr: Snowflake[], client: ReknownClient, guildid: Snowflake) {
  arr.push(guildid);
  client.query(`DELETE FROM ${tables.MUTES} WHERE guildid = $1`, [ guildid ]);
}

async function muteCheck (client: ReknownClient) {
  const { rows } = await client.query<RowMutes>(`SELECT * FROM ${tables.MUTES}`);

  const invalidGuilds: Snowflake[] = [];
  rows.forEach(async row => {
    if (invalidGuilds.includes(row.guildid)) return;

    const guild = client.guilds.cache.get(row.guildid);
    if (!guild) return invalidateGuild(invalidGuilds, client, row.guildid);
    if (!guild.me!.hasPermission('MANAGE_ROLES')) return invalidateGuild(invalidGuilds, client, guild.id);
    const role = await client.functions.getMuteRole(client, guild);
    if (!role) return invalidateGuild(invalidGuilds, client, guild.id);

    const member = await guild.members.fetch(row.userid).catch(() => null);
    if (!member) return client.query(`DELETE FROM ${tables.MUTES} WHERE guildid = $1`, [ row.guildid ]);
    if (!member.roles.cache.has(role.id)) return client.query(`DELETE FROM ${tables.MUTES} WHERE guildid = $1`, [ row.guildid ]);

    const duration = Number(row.endsat) - Date.now();
    if (Number(row.endsat) <= Date.now()) {
      member.roles.remove(role);
      client.query(`DELETE FROM ${tables.MUTES} WHERE guildid = $1`, [ row.guildid ]);
    } else if (duration < ms('20d')) client.mutes.set(member.id, setTimeout(client.functions.unmute.bind(client.functions), duration, member));
  });
}

export async function run (client: ReknownClient) {
  console.log(`Successfully logged in as ${client.user!.tag} (${client.user!.id}).`);
  client.user!.setActivity({
    name: `${client.guilds.cache.size} Servers`,
    type: 'WATCHING'
  });

  for (const emoji in client.config.emojis) {
    if (Object.prototype.hasOwnProperty.call(client.config.emojis, emoji)) {
      client.emotes.set(emoji as EmoteName, client.emojis.cache.get(client.config.emojis[emoji])!);
    }
  }

  client.lavalink = new Node({
    password: process.env.LAVALINK_PASS!,
    userID: client.user!.id,
    host: 'localhost:2333',
    send: function (guild, packet) {
      if (client.guilds.cache.has(guild)) return client.ws.shards.first()!.send(packet);
    },
  });

  muteCheck(client);
}
