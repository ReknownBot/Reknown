import { MessageEmbed } from 'discord.js';
import type ReknownClient from '../structures/client';
import { tables } from '../Constants';
import type { Collection, GuildMember, Role, Snowflake } from 'discord.js';

function nickUpdate (client: ReknownClient, oldMember: GuildMember, newMember: GuildMember) {
  if (oldMember.displayName === newMember.displayName) return;

  const embed = new MessageEmbed()
    .addField('Member', `${newMember} [${client.escMD(newMember.user.tag)}] (ID: ${newMember.id})`)
    .addField('Old Nickname', oldMember.displayName, true)
    .addField('New Nickname', newMember.displayName, true)
    .setColor(client.config.embedColor)
    .setFooter(`ID: ${newMember.id}`)
    .setThumbnail(newMember.user.displayAvatarURL({ size: 512 }))
    .setTimestamp()
    .setTitle('Nickname Updated');

  client.functions.sendLog(client, embed, newMember.guild);
}

async function removeMute (client: ReknownClient, member: GuildMember, roles: Collection<Snowflake, Role>) {
  const role = await client.functions.getMuteRole(client, member.guild);
  if (!role) return;
  if (roles.has(role.id) && client.mutes.has(member.id)) {
    clearTimeout(client.mutes.get(member.id)!);
    client.mutes.delete(member.id);
    client.query(`DELETE FROM ${tables.MUTES} WHERE guildid = $1`, [ member.guild.id ]);
  }
}

function roleUpdate (client: ReknownClient, oldMember: GuildMember, newMember: GuildMember) {
  const addedRoles = newMember.roles.cache.filter(r => !oldMember.roles.cache.has(r.id));
  const removedRoles = oldMember.roles.cache.filter(r => !newMember.roles.cache.has(r.id));
  if (addedRoles.size === 0 && removedRoles.size === 0) return;
  removeMute(client, newMember, removedRoles);

  const embed = new MessageEmbed()
    .addField('Member', `${newMember} [${client.escMD(newMember.user.tag)}] (ID: ${newMember.id})`)
    .addField('Roles Changed', `${addedRoles.map(r => `+ \`\`${client.escInline(r.name)}\`\``).join('\n')}\n${removedRoles.map(r => `- \`\`${client.escInline(r.name)}\`\``).join('\n')}`)
    .setColor(client.config.embedColor)
    .setFooter(`ID: ${newMember.id}`)
    .setThumbnail(newMember.user.displayAvatarURL({ size: 512 }))
    .setTimestamp()
    .setTitle('Member Role Update');

  client.functions.sendLog(client, embed, newMember.guild);
}

export async function run (client: ReknownClient, oldMember: GuildMember, newMember: GuildMember) {
  if (!newMember.guild.available) return;

  nickUpdate(client, oldMember, newMember);
  roleUpdate(client, oldMember, newMember);
}
