function nickChange (Client, oldNick, newNick, guild, member) {
  const embed = new Client.Discord.MessageEmbed()
    .setTitle(`Nickname ${newNick === null ? 'Reset' : 'Changed'}`)
    .setColor(0x00FFFF)
    .setTimestamp()
    .addField('Member', `${member.user.tag} (${member.id})`)
    .setThumbnail(member.user.displayAvatarURL({ size: 2048 }));

  if (newNick === null) {
    embed.addField('Old Nickname', oldNick);
  } else {
    embed.addField('Old Nickname', oldNick, true)
      .addField('New Nickname', newNick, true);
  }

  return require('../functions/sendlog.js')(Client, embed, guild.id);
}

function roleChange (Client, oldMember, newMember) {
  let embed;

  if (oldMember.roles.size > newMember.roles.size) { // Role Removed
    const roles = oldMember.roles.filter(r => !newMember.roles.has(r.id));

    const muteRole = oldMember.guild.roles.find(r => r.name === 'Muted');
    if (muteRole && roles.has(muteRole.id) && Client.mutes.includes(oldMember.id)) Client.mutes.splice(Client.mutes.indexOf(oldMember.id), 1);

    embed = new Client.Discord.MessageEmbed()
      .setTitle('Role Removed')
      .setColor(0xffa500)
      .addField('Member', `${newMember.user.tag} (${newMember.id})`, true)
      .addField('Role', roles.map(r => `${r.name} - ${r.id}`).list(), true)
      .setThumbnail(newMember.user.displayAvatarURL({ size: 2048 }));
  } else { // Role Added
    const roles = newMember.roles.filter(r => !oldMember.roles.has(r.id));

    embed = new Client.Discord.MessageEmbed()
      .setTitle('Role Added')
      .setColor(0x00ff00)
      .addField('Member', `${newMember.user.tag} (${newMember.id})`, true)
      .addField('Role', roles.map(r => `${r.name} - ${r.id}`).list(), true)
      .setThumbnail(newMember.user.displayAvatarURL({ size: 2048 }));
  }

  return require('../functions/sendlog.js')(Client, embed, oldMember.guild.id);
}

module.exports = (Client) => {
  return Client.bot.on('guildMemberUpdate', (oldMember, newMember) => {
    if (oldMember.nickname !== newMember.nickname) nickChange(Client, oldMember.nickname || 'None', newMember.nickname, oldMember.guild, newMember);
    if (oldMember.roles.size !== newMember.roles.size) roleChange(Client, oldMember, newMember);
  });
};
