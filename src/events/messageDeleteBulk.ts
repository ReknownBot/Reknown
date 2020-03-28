import { MessageEmbed } from 'discord.js';
import type ReknownClient from '../structures/client';
import type { TextChannel } from 'discord.js';
import { tables } from '../Constants';
import type { Collection, Snowflake } from 'discord.js';
import type { GuildMessage, RowChannel, RowStarboard, RowToggle } from 'ReknownBot';

async function delStar (client: ReknownClient, message: GuildMessage) {
  const toggled = await client.functions.getRow<RowToggle>(client, tables.STARTOGGLE, {
    guildid: message.guild.id
  });
  if (!toggled || !toggled.bool) return;

  const msgRow = await client.functions.getRow<RowStarboard>(client, tables.STARBOARD, {
    msgid: message.id
  });
  if (!msgRow) return;
  client.query(`DELETE FROM ${tables.STARBOARD} WHERE msgid = $1`, [ message.id ]);

  const channelRow = await client.functions.getRow<RowChannel>(client, tables.STARCHANNEL, {
    guildid: message.guild.id
  });
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
