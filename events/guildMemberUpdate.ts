import { ReknownClient } from "ReknownBot";
import { GuildMember, MessageEmbed } from "discord.js";

function nickUpdate(client: ReknownClient, oldMember: GuildMember, newMember: GuildMember) {
  if (oldMember.displayName === newMember.displayName) return;

  const embed = new MessageEmbed()
    .addField('Member', newMember.user.tag)
    .addField('Old Nickname', oldMember.displayName, true)
    .addField('New Nickname', newMember.displayName, true)
    .setColor(client.config.embedColor)
    .setFooter(`ID: ${newMember.id}`)
    .setTimestamp()
    .setTitle(`Nickname Updated`);

  client.functions.sendLog(client, embed, newMember.guild);
}

module.exports.run = (client: ReknownClient, oldMember: GuildMember, newMember: GuildMember) => {
  if (!newMember.guild.available) return;

  nickUpdate(client, oldMember, newMember);
};
