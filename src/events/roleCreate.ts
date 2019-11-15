import { ReknownClient } from "ReknownBot";
import { Role, MessageEmbed, PermissionString } from "discord.js";

function sendLog (client: ReknownClient, role: Role) {
  const permissions = role.permissions.serialize(false);

  const embed = new MessageEmbed()
    .addField('Role Name', client.escMD(role.name))
    .addField('Permissions', (Object.keys(permissions) as PermissionString[]).map(perm => `${perm}: ${permissions[perm]}`).join('\n'))
    .setColor(client.config.embedColor)
    .setFooter(`ID: ${role.id}`)
    .setTimestamp()
    .setTitle('Role Created');

  client.functions.sendLog(client, embed, role.guild!);
}

export function run (client: ReknownClient, role: Role) {
  if (!role.guild?.available) return;

  sendLog(client, role);
}
