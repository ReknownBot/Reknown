import type ReknownClient from '../structures/client';
import type { Role } from 'discord.js';
import { ColorResolvable, MessageEmbed } from 'discord.js';

function nameUpdate (client: ReknownClient, oldRole: Role, newRole: Role) {
  if (oldRole.name === newRole.name) return;

  const embed = new MessageEmbed()
    .addFields([
      {
        name: 'Old Name',
        value: client.escMD(oldRole.name)
      },
      {
        name: 'New Name',
        value: client.escMD(newRole.name)
      }
    ])
    .setColor(client.config.embedColor as ColorResolvable)
    .setFooter(`ID: ${newRole.id}`)
    .setTimestamp()
    .setTitle('Role Name Changed');

  client.functions.sendLog(client, embed, newRole.guild);
}

function permissionUpdate (client: ReknownClient, oldRole: Role, newRole: Role) {
  if (oldRole.permissions.bitfield === newRole.permissions.bitfield) return;

  const addedPerms = oldRole.permissions.missing(newRole.permissions, false);
  const removedPerms = newRole.permissions.missing(oldRole.permissions, false);

  const embed = new MessageEmbed()
    .addField('Role', newRole.toString())
    .setColor(client.config.embedColor as ColorResolvable)
    .setDescription(`${addedPerms.map(perm => `+ \`\`${perm}\`\``).join('\n')}\n${removedPerms.map(perm => `- \`\`${perm}\`\``).join('\n')}`)
    .setFooter(`ID: ${newRole.id}`)
    .setTimestamp()
    .setTitle('Role Permissions Changed');

  client.functions.sendLog(client, embed, newRole.guild);
}

export async function run (client: ReknownClient, oldRole: Role, newRole: Role) {
  if (!newRole.guild.available) return;

  nameUpdate(client, oldRole, newRole);
  permissionUpdate(client, oldRole, newRole);
}
