import ReknownClient from '../structures/client';
import { GuildMember, MessageEmbed, TextChannel } from 'discord.js';
import dateformat from 'dateformat';
import { ToggleRow, WelcomeChannelRow } from 'ReknownBot';

function sendLog (client: ReknownClient, member: GuildMember) {
  const embed = new MessageEmbed()
    .addField('Created at', dateformat(member.user.createdAt, 'mmmm d, yyyy @ HH:MM:ss UTC'))
    .setColor(client.config.embedColor)
    .setFooter(`ID: ${member.id}`)
    .setTimestamp()
    .setTitle('Member Joined');

  client.functions.sendLog(client, embed, member.guild);
}

async function welcomeMsg (client: ReknownClient, member: GuildMember) {
  const toggledRow: ToggleRow = (await client.query('SELECT bool FROM togglewelcome WHERE guildid = $1', [ member.guild.id ])).rows[0];
  if (!toggledRow || !toggledRow.bool) return;

  const channelRow: WelcomeChannelRow = (await client.query('SELECT channel FROM welcomechannel WHERE guildid = $1', [ member.guild.id ])).rows[0];
  const channel = (channelRow ? member.guild.channels.find(c => c.id === channelRow.channel && c.type === 'text') : member.guild.channels.find(c => c.name === 'action-log' && c.type === 'text')) as TextChannel;
  if (!channel) return;
  if (!channel.permissionsFor(client.user!)!.has([ 'VIEW_CHANNEL', 'SEND_MESSAGES', 'EMBED_LINKS' ])) return;

  const msgRow = (await client.query('SELECT msg FROM welcomemsg WHERE guildid = $1', [ member.guild.id ])).rows[0];
  const msg: string = msgRow ? msgRow.msg : '<User>, Welcome to **<Server>**! There are <MemberCount> members now.';

  const embed = new MessageEmbed()
    .setColor(client.config.embedColor)
    .setDescription(msg.replace(/<MemberCount>/g, member.guild.memberCount.toString()).replace(/<Server>/g, member.guild.name).replace(/<User>/g, member.toString()))
    .setFooter(`ID: ${member.id}`)
    .setTimestamp();
  channel.send(embed);
}

module.exports.run = (client: ReknownClient, member: GuildMember) => {
  if (!member.guild.available) return;
  if (member.id === client.user!.id) return;

  sendLog(client, member);
  welcomeMsg(client, member);
};
