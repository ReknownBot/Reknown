import ReknownClient from '../structures/client';
import { tables } from '../Constants';
import { Guild, MessageEmbed, TextChannel } from 'discord.js';
import { LogChannelRow, ToggleRow, WebhookRow } from 'ReknownBot';

export async function run (client: ReknownClient, embed: MessageEmbed, guild: Guild) {
  const toggledRow = await client.functions.getRow<ToggleRow>(client, tables.LOGTOGGLE, {
    guildid: guild.id
  });
  if (!toggledRow || !toggledRow.bool) return;

  const channelRow = await client.functions.getRow<LogChannelRow>(client, tables.LOGCHANNEL, {
    guildid: guild.id
  });
  const channel = (channelRow ? client.channels.get(channelRow.channelid) : guild.channels.find(c => c.name === 'action-log' && c.type === 'text')) as TextChannel;
  if (!channel) return;
  if (!channel.permissionsFor(client.user!)!.has('MANAGE_WEBHOOKS')) return;
  const webhooks = await channel.fetchWebhooks();
  let webhookRow = await client.functions.getRow<WebhookRow>(client, tables.LOGWEBHOOK, {
    channelid: channel.id
  });
  let webhook;
  if (!webhookRow || !webhooks.has(webhookRow.webhookid)) {
    webhook = await channel.createWebhook('Reknown Logs', {
      avatar: client.user!.displayAvatarURL({ size: 2048 }),
      reason: 'Reknown Logs'
    });
    webhookRow = !webhookRow ?
      (await client.query(`INSERT INTO ${tables.LOGWEBHOOK} (channelid, guildid, webhookid) VALUES ($1, $2, $3) RETURNING *`, [ channel.id, guild.id, webhook.id ])).rows[0] :
      (await client.query(`UPDATE ${tables.LOGWEBHOOK} SET webhookid = $1 WHERE channelid = $2 RETURNING *`, [ webhook.id, channel.id ])).rows[0];
  } else webhook = webhooks.get(webhookRow.webhookid)!;

  webhook.send(embed);
}
