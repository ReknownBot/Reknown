import { MessageEmbed } from 'discord.js';
import type ReknownClient from '../structures/client';
import { tables } from '../Constants';
import type { MessageReaction, PartialUser, TextChannel, User } from 'discord.js';
import type { RowChannel, RowStarboard, RowToggle } from 'ReknownBot';

export async function run (client: ReknownClient, reaction: MessageReaction & { count: number }, user: User | PartialUser) {
  if (reaction.partial) await reaction.fetch();
  if (user.partial) user = await user.fetch();
  if (user.bot) return;
  const { message } = reaction;
  if (message.partial) await message.fetch();
  if (!message.guild?.available) return;
  if (message.webhookID) return;
  if (!message.content && !message.attachments.find(attch => Boolean(attch.height))) return;

  const toggled = await client.functions.getRow<RowToggle>(client, tables.STARTOGGLE, {
    guildid: message.guild.id
  });
  if (!toggled || !toggled.bool) return;

  let { count } = reaction;
  if (count > 0 && reaction.users.has(message.author.id)) count -= 1;
  if (count === 0) client.query(`DELETE FROM ${tables.STARBOARD} WHERE msgid = $1`, [ message.id ]);

  const channelRow = await client.functions.getRow<RowChannel>(client, tables.STARCHANNEL, {
    guildid: message.guild.id
  });
  const channel = (channelRow ? message.guild.channels.get(channelRow.channelid) : message.guild.channels.find(c => c.name === 'starboard' && c.type === 'text')) as TextChannel | undefined;
  if (!channel) return;
  if (!channel.permissionsFor(client.user!)!.has([ 'EMBED_LINKS', 'READ_MESSAGE_HISTORY', 'SEND_MESSAGES', 'VIEW_CHANNEL' ])) return;

  const emoji = reaction.emoji.name;
  if (emoji !== '\u2B50') return;

  const msgRow = await client.functions.getRow<RowStarboard>(client, tables.STARBOARD, {
    msgid: message.id
  });

  const embed = new MessageEmbed()
    .addField('Author', `${message.author} (${message.author.id})`, true)
    .addField('Channel', `${channel} (${channel.id})`, true)
    .addField('Direct Link', `[Click](${message.url})`)
    .setColor(client.config.embedColor)
    .setDescription(message.content)
    .setFooter(`\u2B50${client.functions.formatNum(count)} | ID: ${message.id}`)
    .setTimestamp();
  const img = message.attachments.find(attachment => Boolean(attachment.height));
  if (img) embed.setImage(img.proxyURL);

  if (msgRow) {
    const newMessage = await channel.messages.fetch(msgRow.editid).catch(() => null);
    if (newMessage && !newMessage.partial) {
      if (count === 0) return newMessage.delete();
      return newMessage.edit(embed);
    }
  }

  if (count === 0) return;
  const msg = await channel.send(embed);
  client.functions.updateRow(client, tables.STARBOARD, {
    editid: msg.id,
    msgid: message.id
  }, {
    msgid: message.id
  });
}
