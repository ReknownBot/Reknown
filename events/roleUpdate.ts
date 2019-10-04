import ReknownClient from '../structures/client';
import { GuildMember, MessageEmbed, Role } from 'discord.js';
import dateformat from 'dateformat';

function sendLog (client: ReknownClient, oldRole: Role, newRole: Role) {
  if (oldRole.name === newRole.name) return;

  const embed = new MessageEmbed()
    .addField('Old Name', client.escMD(oldRole.name))
    .addField('New Name', client.escMD(newRole.name))
    .setColor(client.config.embedColor)
    .setFooter(`ID: ${oldRole.id}`)
    .setTimestamp()
    .setTitle('Role Name Changed');

  client.functions.sendLog(client, embed, newRole.guild);
}

module.exports.run = (client: ReknownClient, oldRole: Role, newRole: Role) => {
  if (!newRole.guild.available) return;

  sendLog(client, oldRole, newRole);
};
