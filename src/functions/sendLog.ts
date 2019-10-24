import ReknownClient from '../structures/client';
import { Guild, MessageEmbed, TextChannel } from 'discord.js';
import { LogChannelRow, ToggleRow, WebhookRow } from 'ReknownBot';

module.exports = async (client: ReknownClient, embed: MessageEmbed, guild: Guild) => {
  const toggledRow: ToggleRow = (await client.query('SELECT bool FROM togglelog WHERE guildid = $1', [ guild.id ])).rows[0];
  if (!toggledRow || !toggledRow.bool) return;

  const channelRow: LogChannelRow = (await client.query('SELECT channelid FROM logchannel WHERE guildid = $1', [ guild.id ])).rows[0];
  const channel = (channelRow ? client.channels.get(channelRow.channelid) : guild.channels.find(c => c.name === 'action-log' && c.type === 'text')) as TextChannel;
  if (!channel) return;
  if (!channel.permissionsFor(client.user!)!.has('MANAGE_WEBHOOKS')) return;
  const webhooks = await channel.fetchWebhooks();
  let webhookRow: WebhookRow = (await client.query('SELECT * FROM logwebhook WHERE channelid = $1', [ channel.id ])).rows[0];
  let webhook;
  if (!webhookRow || !webhooks.has(webhookRow.webhookid)) {
    webhook = await channel.createWebhook('Reknown Logs', {
      avatar: client.user!.displayAvatarURL({ size: 2048 }),
      reason: 'Reknown Logs'
    });
    webhookRow = !webhookRow ?
      (await client.query('INSERT INTO logwebhook (channelid, guildid, webhookid) VALUES ($1, $2, $3) RETURNING *', [ channel.id, guild.id, webhook.id ])).rows[0] :
      (await client.query('UPDATE logwebhook SET webhookid = $1 WHERE channelid = $2 RETURNING *', [ webhook.id, channel.id ])).rows[0];
  } else webhook = webhooks.get(webhookRow.webhookid)!;

  webhook.send(embed);
};
