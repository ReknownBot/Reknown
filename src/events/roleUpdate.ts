import ReknownClient from '../structures/client';
import { MessageEmbed, Role } from 'discord.js';

function nameUpdate (client: ReknownClient, oldRole: Role, newRole: Role) {
  if (oldRole.name === newRole.name) return;

  const embed = new MessageEmbed()
    .addField('Old Name', client.escMD(oldRole.name))
    .addField('New Name', client.escMD(newRole.name))
    .setColor(client.config.embedColor)
    .setFooter(`ID: ${newRole.id}`)
    .setTimestamp()
    .setTitle('Role Name Changed');

  client.functions.sendLog(client, embed, newRole.guild);
}

function permissionUpdate (client: ReknownClient, oldRole: Role, newRole: Role) {
  if (oldRole.permissions.bitfield === newRole.permissions.bitfield) return;

  const addedPerms = newRole.permissions.toArray().filter(perm => oldRole.permissions.has(perm));
  const removedPerms = oldRole.permissions.toArray().filter(perm => newRole.permissions.has(perm));

  const embed = new MessageEmbed()
    .addField('Role', newRole.toString())
    .setColor(client.config.embedColor)
    .setDescription(`${addedPerms.map(perm => `+ \`\`${client.escInline(perm)}\`\``).join('\n')}\n${removedPerms.map(perm => `- \`\`${client.escInline(perm)}\`\``).join('\n')}`)
    .setFooter(`ID: ${newRole.id}`)
    .setTimestamp()
    .setTitle('Role Permissions Changed');

  client.functions.sendLog(client, embed, newRole.guild)
}

export async function run (client: ReknownClient, oldRole: Role, newRole: Role) {
  if (!newRole.guild.available) return;

  nameUpdate(client, oldRole, newRole);
  permissionUpdate(client, oldRole, newRole);
}
