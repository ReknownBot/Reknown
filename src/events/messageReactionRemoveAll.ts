import type ColumnTypes from '../typings/ColumnTypes';
import type ReknownClient from '../structures/Client';
import { tables } from '../Constants';
import { Message, PartialMessage, Permissions, TextChannel } from 'discord.js';

export async function run (client: ReknownClient, message: Message | PartialMessage | null) {
  if (message!.partial) message = await message!.fetch().catch(() => null);
  if (!message) return;
  if (!message.guild?.available) return;
  if (message.webhookId) return;
  if (!message.content && !message.attachments.find(attch => Boolean(attch.height))) return;

  const [ toggled ] = await client.sql<ColumnTypes['TOGGLE'][]>`
    SELECT * FROM ${client.sql(tables.STARTOGGLE)}
      WHERE guildid = ${message.guild.id}
  `;
  if (!toggled || !toggled.bool) return;

  const [ msgRow ] = await client.sql<ColumnTypes['STARBOARD'][]>`
    SELECT * FROM ${client.sql(tables.STARBOARD)}
      WHERE msgid = ${message.id}
  `;
  if (!msgRow) return;
  client.sql`DELETE FROM ${client.sql(tables.STARBOARD)} WHERE msgid = ${message.id}`;

  const [ channelRow ] = await client.sql<ColumnTypes['CHANNEL'][]>`
    SELECT * FROM ${client.sql(tables.STARCHANNEL)}
      WHERE guildid = ${message.guild.id}
  `;
  const channel = (channelRow ? message.guild.channels.cache.get(channelRow.channelid) : message.guild.channels.cache.find(c => c.name === 'starboard' && c.type === 'GUILD_TEXT')) as TextChannel | undefined;
  if (!channel) return;
  if (!channel.permissionsFor(client.user!)!.has([ Permissions.FLAGS.READ_MESSAGE_HISTORY, Permissions.FLAGS.VIEW_CHANNEL ])) return;

  const msg = await channel.messages.fetch(msgRow.editid).catch(() => null);
  if (msg && !msg.deleted) msg.delete();
}
