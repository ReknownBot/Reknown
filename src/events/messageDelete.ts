import type ColumnTypes from '../typings/ColumnTypes';
import type { GuildMessage } from '../Constants';
import { MessageEmbed } from 'discord.js';
import type ReknownClient from '../structures/client';
import type { TextChannel } from 'discord.js';
import { tables } from '../Constants';
import type { Message, PartialMessage } from 'discord.js';

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

function sendLog (client: ReknownClient, message: GuildMessage) {
  if (!message.content && !message.attachments.find(attch => Boolean(attch.height))) return;

  const embed = new MessageEmbed()
    .addField('Author', `${message.author} [${client.escMD(message.author.tag)}] (ID: ${message.author.id})`)
    .setColor(client.config.embedColor)
    .setDescription(message.content)
    .setFooter(`ID: ${message.id}`)
    .setTimestamp()
    .setTitle('Message Deleted');
  const img = message.attachments.find(attachment => Boolean(attachment.height));
  if (img) embed.setImage(img.proxyURL);

  client.functions.sendLog(client, embed, message.guild);
}

export async function run (client: ReknownClient, message: Message | PartialMessage) {
  if (!message.guild?.available) return;
  if (message.webhookID) return;

  delStar(client, message as GuildMessage);
  sendLog(client, message as GuildMessage);
}
