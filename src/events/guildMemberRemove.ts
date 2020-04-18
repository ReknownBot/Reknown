import type ColumnTypes from '../typings/ColumnTypes';
import { MessageEmbed } from 'discord.js';
import type ReknownClient from '../structures/client';
import dateformat from 'dateformat';
import { tables } from '../Constants';
import type { GuildMember, PartialGuildMember, TextChannel } from 'discord.js';

function sendLog (client: ReknownClient, member: GuildMember | PartialGuildMember) {
  const embed = new MessageEmbed()
    .addField('User', `${member} [${client.escMD(member.user!.tag)}] (ID: ${member.id})`)
    .setColor(client.config.embedColor)
    .setFooter(`ID: ${member.id}`)
    .setTimestamp()
    .setTitle('Member Left');

  if (member.joinedAt) embed.addField('Joined at', dateformat(member.joinedAt, 'mmmm d, yyyy @ HH:MM:ss UTC'));

  client.functions.sendLog(client, embed, member.guild);
}

async function goodbyeMsg (client: ReknownClient, member: GuildMember | PartialGuildMember) {
  const [ toggledRow ] = await client.sql<ColumnTypes['TOGGLE']>`
    SELECT * FROM ${client.sql(tables.WELCOMETOGGLE)}
      WHERE guildid = ${member.guild.id}
  `;
  if (!toggledRow || !toggledRow.bool) return;

  const [ channelRow ] = await client.sql<ColumnTypes['CHANNEL']>`
    SELECT * FROM ${client.sql(tables.WELCOMECHANNEL)}
      WHERE guildid = ${member.guild.id}
  `;
  const channel = (channelRow ?
    member.guild.channels.cache.find(c => c.id === channelRow.channelid && c.type === 'text') :
    member.guild.channels.cache.find(c => c.name === 'action-log' && c.type === 'text')) as TextChannel | undefined;
  if (!channel) return;
  if (!channel.permissionsFor(client.user!)!.has([ 'VIEW_CHANNEL', 'SEND_MESSAGES', 'EMBED_LINKS' ])) return;

  const [ msgRow ] = await client.sql<ColumnTypes['MSG']>`
    SELECT * FROM ${client.sql(tables.GOODBYEMSG)}
      WHERE guildid = ${member.guild.id}
  `;
  const msg: string = msgRow ? msgRow.msg : '<User> has left **<Server>**. There are <MemberCount> members now.';

  const embed = new MessageEmbed()
    .setColor(client.config.embedColor)
    .setDescription(msg.replace(/<MemberCount>/g, member.guild.memberCount.toString()).replace(/<Server>/g, member.guild.name).replace(/<User>/g, member.user!.toString()))
    .setFooter(`ID: ${member.id}`)
    .setThumbnail(member.user!.displayAvatarURL({ size: 512 }))
    .setTimestamp();
  channel.send(embed);
}

export async function run (client: ReknownClient, member: GuildMember | PartialGuildMember) {
  if (!member.guild.available) return;
  if (member.id === client.user!.id) return;

  sendLog(client, member);
  goodbyeMsg(client, member);
}
