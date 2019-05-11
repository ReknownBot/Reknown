/**
 * @param {import('../structures/client.js')} Client
 */
module.exports = Client => {
  return Client.bot.once('ready', async () => {
    console.log(`Logged in as ${Client.bot.user.tag}!`);

    Client.bot.user.setActivity(`${Client.bot.users.filter(u => !u.bot).size} Users and ${Client.bot.guilds.size} Servers`, {
      type: 'WATCHING'
    });

    const { rows: muteRows } = await Client.sql.query('SELECT * FROM mute');
    muteRows.forEach(row => {
      if (Date.now() - row.mutedat > row.time) {
        Client.sql.query('DELETE FROM mute WHERE userid = $1 AND guildid = $2', [row.userid, row.guildid]);
        const guild = Client.bot.guilds.get(row.guildid);
        if (!guild || !guild.me.hasPermission('MANAGE_ROLES')) return;
        const member = guild.members.get(row.userid);
        if (!member) return;
        const role = member.roles.find(r => r.name === 'Muted');
        if (!role || role.position >= guild.me.roles.highest.position) return;
        return member.roles.remove(role);
      }
      const timeout = setTimeout(() => {
        clearTimeout(Client.mutes.get(row.userid));
        Client.mutes.delete(row.userid);
        Client.sql.query('DELETE FROM mute WHERE userid = $1 AND guildid = $2', [row.userid, row.guildid]);

        const guild = Client.bot.guilds.get(row.guildid);
        if (!guild || !guild.me.hasPermission('MANAGE_ROLES')) return;
        const member = guild.members.get(row.userid);
        if (!member) return;
        const role = member.roles.find(r => r.name === 'Muted');
        if (!role || role.position >= guild.me.roles.highest.position) return;
        return member.roles.remove(role);
      }, row.time);
      Client.mutes.set(row.userid, timeout);
    });

    const { rows: dailyRows } = await Client.sql.query('SELECT * FROM daily');
    return dailyRows.forEach(row => {
      if (Date.now() - row.time > 57600000) Client.sql.query('DELETE FROM daily WHERE userid = $1', [row.userid]);
    });
  });
};
