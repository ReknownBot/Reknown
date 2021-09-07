import type ReknownClient from '../structures/Client';
import type { ColorResolvable, Role } from 'discord.js';
import { MessageEmbed, PermissionString } from 'discord.js';

function sendLog (client: ReknownClient, role: Role) {
  const permissions = role.permissions.serialize(false);

  const embed = new MessageEmbed()
    .addFields([
      {
        name: 'Role Name',
        value: client.escMD(role.name)
      },
      {
        name: 'Permissions',
        value: `\`${Object.keys(permissions).map(perm => `${perm}: ${permissions[perm as PermissionString]}`).join('\n')}\``
      }
    ])
    .setColor(client.config.embedColor as ColorResolvable)
    .setFooter(`ID: ${role.id}`)
    .setTimestamp()
    .setTitle('Role Deleted');

  client.functions.sendLog(client, embed, role.guild);
}

export async function run (client: ReknownClient, role: Role) {
  if (!role.guild.available) return;

  sendLog(client, role);
}
