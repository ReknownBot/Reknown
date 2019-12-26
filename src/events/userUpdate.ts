import ReknownClient from '../structures/client';
import { Guild, MessageEmbed, User } from 'discord.js';

function avatarUpdate (client: ReknownClient, oldUser: User, newUser: User, guild: Guild) {
  if (oldUser.displayAvatarURL() === newUser.displayAvatarURL()) return;

  const embed = new MessageEmbed()
    .setColor(client.config.embedColor)
    .setDescription(`[Old Avatar](${oldUser.displayAvatarURL()}) => [New Avatar](${newUser.displayAvatarURL()})`)
    .setFooter(`ID: ${newUser.id} | Tip: The larger one is the new one!`)
    .setImage(newUser.displayAvatarURL())
    .setThumbnail(oldUser.displayAvatarURL())
    .setTimestamp()
    .setTitle('Avatar Updated');

  client.functions.sendLog(client, embed, guild);
}

export async function run (client: ReknownClient, oldUser: User, newUser: User) {
  client.guilds.filter(g => g.members.has(newUser.id)).forEach(g => avatarUpdate(client, oldUser, newUser, g));
}
