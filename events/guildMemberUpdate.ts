import { ReknownClient } from 'ReknownBot';
import { GuildMember, MessageEmbed } from 'discord.js';

function nickUpdate (client: ReknownClient, oldMember: GuildMember, newMember: GuildMember) {
  if (oldMember.displayName === newMember.displayName) return;

  const embed = new MessageEmbed()
    .addField('Member', newMember.user.tag)
    .addField('Old Nickname', oldMember.displayName, true)
    .addField('New Nickname', newMember.displayName, true)
    .setColor(client.config.embedColor)
    .setFooter(`ID: ${newMember.id}`)
    .setTimestamp()
    .setTitle('Nickname Updated');

  client.functions.sendLog(client, embed, newMember.guild);
}

function roleUpdate (client: ReknownClient, oldMember: GuildMember, newMember: GuildMember) {
  const addedRoles = newMember.roles.filter(r => !oldMember.roles.has(r.id));
  const removedRoles = oldMember.roles.filter(r => !newMember.roles.has(r.id));
  if (addedRoles.size === 0 && removedRoles.size === 0) return;

  const embed = new MessageEmbed()
    .addField('Member', newMember.user.tag)
    .addField('Roles Changed', `${addedRoles.map(r => `+ \`${client.escMD(r.name)}\``)}\n${removedRoles.map(r => `- \`${client.escMD(r.name)}\``)}`)
    .setColor(client.config.embedColor)
    .setFooter(`ID: ${newMember.id}`)
    .setTimestamp()
    .setTitle('Member Role Update');

  client.functions.sendLog(client, embed, newMember.guild);
}

module.exports.run = (client: ReknownClient, oldMember: GuildMember, newMember: GuildMember) => {
  if (!newMember.guild.available) return;

  nickUpdate(client, oldMember, newMember);
  roleUpdate(client, oldMember, newMember);
};
