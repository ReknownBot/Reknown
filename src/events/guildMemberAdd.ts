import type ColumnTypes from '../typings/ColumnTypes';
import { MessageEmbed } from 'discord.js';
import type ReknownClient from '../structures/client';
import dateformat from 'dateformat';
import { tables } from '../Constants';
import type { GuildMember, TextChannel } from 'discord.js';

async function checkMute (client: ReknownClient, member: GuildMember) {
  if (!member.guild.me!.hasPermission('MANAGE_ROLES')) return;
  const row = await client.functions.getRow<ColumnTypes['MUTES']>(client, tables.MUTES, {
    guildid: member.guild.id,
    userid: member.id
  });
  if (!row) return;

  const role = await client.functions.getMuteRole(client, member.guild);
  if (!role) return;

  member.roles.add(role, 'Muted');
}

function sendLog (client: ReknownClient, member: GuildMember) {
  const embed = new MessageEmbed()
    .addFields([
      {
        name: 'User',
        value: `${member} [${client.escMD(member.user.tag)}] (ID: ${member.id})`
      },
      {
        name: 'Created at',
        value: dateformat(member.user.createdAt, 'mmmm d, yyyy @ HH:MM:ss UTC')
      }
    ])
    .setColor(client.config.embedColor)
    .setFooter(`ID: ${member.id}`)
    .setTimestamp()
    .setTitle('Member Joined');

  client.functions.sendLog(client, embed, member.guild);
}

async function welcomeMsg (client: ReknownClient, member: GuildMember) {
  const toggledRow = await client.functions.getRow<ColumnTypes['TOGGLE']>(client, tables.WELCOMETOGGLE, {
    guildid: member.guild.id
  });
  if (!toggledRow || !toggledRow.bool) return;

  const channelRow = await client.functions.getRow<ColumnTypes['CHANNEL']>(client, tables.WELCOMECHANNEL, {
    guildid: member.guild.id
  });
  const channel = (channelRow ?
    member.guild.channels.cache.find(c => c.id === channelRow.channelid && c.type === 'text') :
    member.guild.channels.cache.find(c => c.name === 'action-log' && c.type === 'text')) as TextChannel | undefined;
  if (!channel) return;
  if (!channel.permissionsFor(client.user!)!.has([ 'VIEW_CHANNEL', 'SEND_MESSAGES', 'EMBED_LINKS' ])) return;

  const msgRow = await client.functions.getRow<ColumnTypes['MSG']>(client, tables.WELCOMEMSG, {
    guildid: member.guild.id
  });
  const msg: string = msgRow ? msgRow.msg : '<User>, Welcome to **<Server>**! There are <MemberCount> members now.';

  const embed = new MessageEmbed()
    .setColor(client.config.embedColor)
    .setDescription(msg.replace(/<MemberCount>/g, member.guild.memberCount.toString()).replace(/<Server>/g, member.guild.name).replace(/<User>/g, member.toString()))
    .setFooter(`ID: ${member.id}`)
    .setThumbnail(member.user.displayAvatarURL({ size: 512 }))
    .setTimestamp();
  channel.send(embed);
}

export async function run (client: ReknownClient, member: GuildMember) {
  if (!member.guild.available) return;
  if (member.id === client.user!.id) return;

  checkMute(client, member);
  sendLog(client, member);
  welcomeMsg(client, member);
}
