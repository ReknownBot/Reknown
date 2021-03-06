import type ColumnTypes from '../typings/ColumnTypes';
import type { GuildMessage } from '../Constants';
import { MessageEmbed } from 'discord.js';
import type ReknownClient from '../structures/client';
import type { TextChannel } from 'discord.js';
import { tables } from '../Constants';
import type { Collection, Snowflake } from 'discord.js';

async function delStar (client: ReknownClient, message: GuildMessage) {
  const [ toggled ] = await client.sql<ColumnTypes['TOGGLE']>`
    SELECT * FROM ${client.sql(tables.STARTOGGLE)}
      WHERE guildid = ${message.guild.id}
  `;
  if (!toggled || !toggled.bool) return;

  const [ msgRow ] = await client.sql<ColumnTypes['STARBOARD']>`
    SELECT * FROM ${client.sql(tables.STARBOARD)}
      WHERE msgid = ${message.id}
  `;
  if (!msgRow) return;
  client.sql`DELETE FROM ${client.sql(tables.STARBOARD)} WHERE msgid = ${message.id}`;

  const [ channelRow ] = await client.sql<ColumnTypes['CHANNEL']>`
    SELECT * FROM ${client.sql(tables.STARCHANNEL)}
      WHERE guildid = ${message.guild.id}
  `;
  const channel = (channelRow ? message.guild.channels.cache.get(channelRow.channelid) : message.guild.channels.cache.find(c => c.name === 'starboard' && c.type === 'text')) as TextChannel | undefined;
  if (!channel) return;
  if (!channel.permissionsFor(client.user!)!.has([ 'READ_MESSAGE_HISTORY', 'VIEW_CHANNEL' ])) return;

  const msg = await channel.messages.fetch(msgRow.editid).catch(() => null);
  if (msg && !msg.deleted) msg.delete();
}

function sendLog (client: ReknownClient, messages: Collection<Snowflake, GuildMessage>) {
  const { channel } = messages.first()!;
  const { guild } = channel;

  const embed = new MessageEmbed()
    .addFields([
      {
        inline: true,
        name: 'Amount',
        value: messages.size.toString()
      },
      {
        inline: true,
        name: 'Channel',
        value: channel.toString()
      }
    ])
    .setColor(client.config.embedColor)
    .setTimestamp()
    .setTitle('Messages Bulk Deleted');

  client.functions.sendLog(client, embed, guild);
}

export async function run (client: ReknownClient, messages: Collection<Snowflake, GuildMessage>) {
  if (!messages.first()!.guild.available) return;

  for (const [ , message ] of messages) {
    delStar(client, message);
  }

  sendLog(client, messages);
}
