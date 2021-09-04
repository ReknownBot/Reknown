import type ColumnTypes from '../typings/ColumnTypes';
import type ReknownClient from '../structures/client';
import { tables } from '../Constants';
import { ColorResolvable, MessageEmbed, Permissions } from 'discord.js';
import type { MessageReaction, PartialUser, TextChannel, User } from 'discord.js';

export async function run (client: ReknownClient, reaction: MessageReaction & { count: number }, user: User | PartialUser) {
  if (reaction.partial) await reaction.fetch().catch(() => null);
  if (user.partial) user = await user.fetch();
  if (user.bot) return;
  const message = reaction.message;
  if (!message.guild?.available) return;
  if (message.webhookId) return;
  if (!message.content && !message.attachments.find(attch => Boolean(attch.height))) return;

  const [ toggled ] = await client.sql<ColumnTypes['TOGGLE'][]>`
    SELECT * FROM ${client.sql(tables.STARTOGGLE)}
      WHERE guildid = ${message.guild.id}
  `;
  if (!toggled || !toggled.bool) return;

  let { count } = reaction;
  if (reaction.users.cache.has(message.author!.id)) count -= 1;
  if (count === 0) return client.sql`DELETE FROM ${client.sql(tables.STARBOARD)} WHERE msgid = ${message.id}`;

  const [ channelRow ] = await client.sql<ColumnTypes['CHANNEL'][]>`
    SELECT * FROM ${client.sql(tables.STARCHANNEL)}
      WHERE guildid = ${message.guild.id}
  `;
  const channel = (channelRow ? message.guild.channels.cache.get(channelRow.channelid) : message.guild.channels.cache.find(c => c.name === 'starboard' && c.type === 'GUILD_TEXT')) as TextChannel | undefined;
  if (!channel) return;
  if (!channel.permissionsFor(client.user!)!.has([ Permissions.FLAGS.EMBED_LINKS, Permissions.FLAGS.READ_MESSAGE_HISTORY, Permissions.FLAGS.SEND_MESSAGES, Permissions.FLAGS.VIEW_CHANNEL ])) return;

  const emoji = reaction.emoji.name;
  if (emoji !== '\u2B50') return;

  const [ msgRow ] = await client.sql<ColumnTypes['STARBOARD'][]>`
    SELECT * FROM ${client.sql(tables.STARBOARD)}
      WHERE msgid = ${message.id}
  `;

  const embed = new MessageEmbed()
    .addFields([
      {
        inline: true,
        name: 'Author',
        value: `${message.author} (${message.author!.id})`
      },
      {
        inline: true,
        name: 'Channel',
        value: `${channel} (${channel.id})`
      },
      {
        name: 'Direct Link',
        value: `[Click](${message.url})`
      }
    ])
    .setColor(client.config.embedColor as ColorResolvable)
    .setDescription(message.content || '')
    .setFooter(`\u2B50${client.functions.formatNum(count)} | ID: ${message.id}`)
    .setTimestamp();
  const img = message.attachments.find(attachment => Boolean(attachment.height));
  if (img) embed.setImage(img.proxyURL);

  if (msgRow) {
    const newMessage = await channel.messages.fetch(msgRow.editid).catch(() => null);
    if (newMessage) return newMessage.edit({ embeds: [ embed ] });
  }

  const msg = await channel.send({ embeds: [ embed ] });

  const columns = {
    editid: msg.id,
    msgid: message.id
  };
  client.sql`
    INSERT INTO ${client.sql(tables.STARBOARD)} ${client.sql(columns)}
      ON CONFLICT (msgid) DO UPDATE
        SET ${client.sql(columns)}
  `;
}
