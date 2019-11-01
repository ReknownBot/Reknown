import { ReknownClient } from "ReknownBot";
import { User, MessageEmbed, Guild } from "discord.js";

function avatarUpdate (client: ReknownClient, oldUser: User, newUser: User, guild: Guild) {
  if (oldUser.displayAvatarURL() === newUser.displayAvatarURL()) return;

  const embed = new MessageEmbed()
    .setColor(client.config.embedColor)
    .setDescription(`[Old Avatar](${oldUser.displayAvatarURL({ size: 2048 })}) => [New Avatar](${newUser.displayAvatarURL({ size: 2048 })})`)
    .setFooter(`ID: ${newUser.id} | Tip: The larger one is the new one!`)
    .setImage(newUser.displayAvatarURL({ size: 2048 }))
    .setThumbnail(oldUser.displayAvatarURL({ size: 2048 }))
    .setTimestamp()
    .setTitle('Avatar Updated');

  client.functions.sendLog(client, embed, guild);
}

export async function run (client: ReknownClient, oldUser: User, newUser: User) {
  client.guilds.filter(g => g.members.has(newUser.id)).forEach(g => avatarUpdate(client, oldUser, newUser, g));
}
