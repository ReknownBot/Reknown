import { MessageEmbed } from 'discord.js';
import type ReknownClient from '../structures/client';
import type { Guild, User } from 'discord.js';

function avatarUpdate (client: ReknownClient, oldUser: User, newUser: User, guild: Guild) {
  if (oldUser.displayAvatarURL() === newUser.displayAvatarURL()) return;

  const embed = new MessageEmbed()
    .addField('User', `${newUser} [${client.escMD(newUser.tag)}] (ID: ${newUser.id})`)
    .setColor(client.config.embedColor)
    .setDescription(`[Old Avatar](${oldUser.displayAvatarURL()}) => [New Avatar](${newUser.displayAvatarURL()})`)
    .setFooter(`ID: ${newUser.id} | Tip: The larger one is the new one!`)
    .setImage(newUser.displayAvatarURL())
    .setThumbnail(oldUser.displayAvatarURL())
    .setTimestamp()
    .setTitle('Avatar Updated');

  client.functions.sendLog(client, embed, guild);
}

function usernameUpdate (client: ReknownClient, oldUser: User, newUser: User, guild: Guild) {
  if (oldUser.username === newUser.username) return;

  const embed = new MessageEmbed()
    .setColor(client.config.embedColor)
    .setDescription(`\`\`${client.escInline(oldUser.tag)}\`\` => \`\`${client.escInline(newUser.tag)}\`\``)
    .setFooter(`ID: ${newUser.id}`)
    .setThumbnail(newUser.displayAvatarURL({ size: 512 }))
    .setTimestamp()
    .setTitle('Username Updated');

  client.functions.sendLog(client, embed, guild);
}

export async function run (client: ReknownClient, oldUser: User, newUser: User) {
  client.guilds.cache.filter(g => g.members.cache.has(newUser.id)).forEach(g => {
    avatarUpdate(client, oldUser, newUser, g);
    usernameUpdate(client, oldUser, newUser, g);
  });
}
