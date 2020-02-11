import type { Message } from 'discord.js';
import { MessageEmbed } from 'discord.js';
import type ReknownClient from '../structures/client';
import type { TextChannel } from 'discord.js';
import { tables } from '../Constants';
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

export async function run (client: ReknownClient, message: Message) {
  if (!message.guild?.available) return;

  delStar(client, message as GuildMessage);
  sendLog(client, message as GuildMessage);
}
