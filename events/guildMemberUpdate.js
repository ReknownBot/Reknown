/**
 * @param {import('../structures/client.js')} Client
 * @param {String} oldNick
 * @param {String} newNick
 * @param {import('discord.js').Guild} guild
 * @param {import('discord.js').GuildMember} member
 */
function nickChange(Client, oldNick, newNick, guild, member) {
  const embed = new Client.Discord.MessageEmbed()
    .setTitle(`Nickname ${newNick === null ? 'Reset' : 'Changed'}`)
    .setColor(0x00FFFF)
    .setTimestamp()
    .addField('Member', `${member.user.tag} (${member.id})`)
    .setThumbnail(member.user.displayAvatarURL({ size: 2048 }));

  if (newNick === null) {
    embed.addField('Old Nickname', Client.escMD(oldNick));
  } else {
    embed.addField('Old Nickname', Client.escMD(oldNick), true)
      .addField('New Nickname', Client.escMD(newNick), true);
  }

  return Client.functions.get('sendlog')(Client, embed, guild.id);
}

/**
 * @param {import('../structures/client.js').} Client
 * @param {import('discord.js').GuildMember} oldMember
 * @param {import('discord.js').GuildMember} newMember
 */
function roleChange (Client, oldMember, newMember) {
  let embed;

  if (oldMember.roles.size > newMember.roles.size) { // Role Removed
    const roles = oldMember.roles.filter(r => !newMember.roles.has(r.id));

    const muteRole = oldMember.guild.roles.find(r => r.name === 'Muted');
    if (muteRole && roles.has(muteRole.id) && Client.mutes.has(oldMember.id)) {
      Client.sql.query('DELETE FROM mute WHERE userid = $1 AND guildid = $2', [oldMember.id, oldMember.guild.id]);
      clearTimeout(Client.mutes.get(oldMember.id));
      Client.mutes.delete(oldMember.id);
    }

    embed = new Client.Discord.MessageEmbed()
      .setTitle('Role Removed')
      .setColor(0xffa500)
      .addField('Member', `${newMember.user.tag} (${newMember.id})`, true)
      .addField('Role', roles.map(r => `${Client.escMD(r.name)} - ${r.id}`).list(), true)
      .setThumbnail(newMember.user.displayAvatarURL({ size: 2048 }));
  } else { // Role Added
    const roles = newMember.roles.filter(r => !oldMember.roles.has(r.id));

    embed = new Client.Discord.MessageEmbed()
      .setTitle('Role Added')
      .setColor(0x00ff00)
      .addField('Member', `${newMember.user.tag} (${newMember.id})`, true)
      .addField('Role', roles.map(r => `${Client.escMD(r.name)} - ${r.id}`).list(), true)
      .setThumbnail(newMember.user.displayAvatarURL({ size: 2048 }));
  }

  return Client.functions.get('sendlog')(Client, embed, oldMember.guild.id);
}

/**
 * @param {import('../structures/client.js')} Client
 */
module.exports = (Client) => {
  return Client.bot.on('guildMemberUpdate', (oldMember, newMember) => {
    if (!newMember.guild.available) return;
    if (oldMember.partial || newMember.partial) return newMember.fetch();

    if (oldMember.nickname !== newMember.nickname) nickChange(Client, oldMember.nickname || 'None', newMember.nickname, oldMember.guild, newMember);
    if (oldMember.roles.size !== newMember.roles.size) roleChange(Client, oldMember, newMember);
  });
};
