import { tables } from '../Constants';
import { ChannelRow, ReknownClient, StarMessageRow, ToggleRow } from 'ReknownBot';
import { Message, MessageEmbed, TextChannel } from 'discord.js';

async function delStar (client: ReknownClient, message: Message) {
  const toggled = await client.functions.getRow<ToggleRow>(client, tables.STARTOGGLE, {
    guildid: message.guild!.id
  });
  if (!toggled || !toggled.bool) return;

  const msgRow = await client.functions.getRow<StarMessageRow>(client, tables.STARBOARD, {
    msgid: message.id
  });
  if (!msgRow) return;
  client.query(`DELETE FROM ${tables.STARBOARD} WHERE msgid = $1`, [ message.id ]);

  const channelRow = await client.functions.getRow<ChannelRow>(client, tables.STARCHANNEL, {
    guildid: message.guild!.id
  });
  const channel = (channelRow ? message.guild!.channels.get(channelRow.channelid) : message.guild!.channels.find(c => c.name === 'starboard' && c.type === 'text')) as TextChannel | undefined;
  if (!channel) return;
  if (!channel.permissionsFor(client.user!)!.has([ 'READ_MESSAGE_HISTORY', 'VIEW_CHANNEL' ])) return;

  const msg = await channel.messages.fetch(msgRow.editid).catch(() => null);
  if (msg && !msg.deleted) msg.delete();
}

function sendLog (client: ReknownClient, message: Message) {
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

  client.functions.sendLog(client, embed, message.guild!);
}

export function run (client: ReknownClient, message: Message) {
  if (!message.guild || !message.guild.available) return;

  delStar(client, message);
  sendLog(client, message);
}
