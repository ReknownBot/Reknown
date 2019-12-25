import ReknownClient from '../structures/client';
import dateformat from 'dateformat';
import { tables } from '../Constants';
import { GuildMember, MessageEmbed, TextChannel } from 'discord.js';
import { RowChannel, RowMsg, RowToggle } from 'ReknownBot';

function sendLog (client: ReknownClient, member: GuildMember) {
  const embed = new MessageEmbed()
    .addField('User', member.user.tag)
    .addField('Joined at', dateformat(member.joinedAt!, 'mmmm d, yyyy @ HH:MM:ss UTC'))
    .setColor(client.config.embedColor)
    .setFooter(`ID: ${member.id}`)
    .setTimestamp()
    .setTitle('Member Left');

  client.functions.sendLog(client, embed, member.guild);
}

async function goodbyeMsg (client: ReknownClient, member: GuildMember) {
  const toggledRow = await client.functions.getRow<RowToggle>(client, tables.WELCOMETOGGLE, {
    guildid: member.guild.id
  });
  if (!toggledRow || !toggledRow.bool) return;

  const channelRow = await client.functions.getRow<RowChannel>(client, tables.WELCOMECHANNEL, {
    guildid: member.guild.id
  });
  const channel = (channelRow ? member.guild.channels.find(c => c.id === channelRow.channelid && c.type === 'text') : member.guild.channels.find(c => c.name === 'action-log' && c.type === 'text')) as TextChannel;
  if (!channel) return;
  if (!channel.permissionsFor(client.user!)!.has([ 'VIEW_CHANNEL', 'SEND_MESSAGES', 'EMBED_LINKS' ])) return;

  const msgRow = await client.functions.getRow<RowMsg>(client, tables.GOODBYEMSG, {
    guildid: member.guild.id
  });
  const msg: string = msgRow ? msgRow.msg : '<User> has left **<Server>**. There are <MemberCount> members now.';

  const embed = new MessageEmbed()
    .setColor(client.config.embedColor)
    .setDescription(msg.replace(/<MemberCount>/g, member.guild.memberCount.toString()).replace(/<Server>/g, member.guild.name).replace(/<User>/g, member.user.toString()))
    .setFooter(`ID: ${member.id}`)
    .setThumbnail(member.user.displayAvatarURL({ size: 512 }))
    .setTimestamp();
  channel.send(embed);
}

export async function run (client: ReknownClient, member: GuildMember) {
  if (!member.guild.available) return;
  if (member.id === client.user!.id) return;
  if (member.user.partial) member.user = await member.user.fetch();

  sendLog(client, member);
  goodbyeMsg(client, member);
}
