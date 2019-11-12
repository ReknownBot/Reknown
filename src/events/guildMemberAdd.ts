import ReknownClient from '../structures/client';
import dateformat from 'dateformat';
import { tables } from '../Constants';
import { ChannelRow, MsgRow, ToggleRow } from 'ReknownBot';
import { GuildMember, MessageEmbed, TextChannel } from 'discord.js';

function sendLog (client: ReknownClient, member: GuildMember) {
  const embed = new MessageEmbed()
    .addField('User', member.user.tag)
    .addField('Created at', dateformat(member.user.createdAt, 'mmmm d, yyyy @ HH:MM:ss UTC'))
    .setColor(client.config.embedColor)
    .setFooter(`ID: ${member.id}`)
    .setTimestamp()
    .setTitle('Member Joined');

  client.functions.sendLog(client, embed, member.guild);
}

async function welcomeMsg (client: ReknownClient, member: GuildMember) {
  const toggledRow = await client.functions.getRow<ToggleRow>(client, tables.WELCOMETOGGLE, {
    guildid: member.guild.id
  });
  if (!toggledRow || !toggledRow.bool) return;

  const channelRow = await client.functions.getRow<ChannelRow>(client, tables.WELCOMECHANNEL, {
    guildid: member.guild.id
  });
  const channel = (channelRow ? member.guild.channels.find(c => c.id === channelRow.channelid && c.type === 'text') : member.guild.channels.find(c => c.name === 'action-log' && c.type === 'text')) as TextChannel;
  if (!channel) return;
  if (!channel.permissionsFor(client.user!)!.has([ 'VIEW_CHANNEL', 'SEND_MESSAGES', 'EMBED_LINKS' ])) return;

  const msgRow = await client.functions.getRow<MsgRow>(client, tables.WELCOMEMSG, {
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

  sendLog(client, member);
  welcomeMsg(client, member);
}
