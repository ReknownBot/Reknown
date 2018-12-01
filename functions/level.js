module.exports = async (Client, message) => {
  const toggleLevel = (await Client.sql.query('SELECT * FROM toggleLevel WHERE guildId = $1 LIMIT 1', [message.guild.id])).rows[0];
  if (!toggleLevel || !toggleLevel.bool) return;

  const scoreCount = (await Client.sql.query('SELECT * FROM scores WHERE userID = $1 AND guildID = $2 LIMIT 1', [message.author.id, message.guild.id])).rows[0];
  if (!scoreCount) return Client.sql.query('INSERT INTO scores (userID, guildID, points, level) VALUES ($1, $2, $3, $4)', [message.author.id, message.guild.id, 1, 0]);

  if (scoreCount.points > 25000000) return;

  const curLevel = Math.floor(0.2 * Math.sqrt(scoreCount.points + message.content.length));
  const curPoints = message.content.length + scoreCount.points;

  if (curLevel > scoreCount.level) {
    Client.sql.query('UPDATE scores SET level = $1, points = $2 WHERE userID = $3 AND guildID = $4', [curLevel, curPoints, message.author.id, message.guild.id]);
    let msg = await message.channel.send(`GG ${message.author}! You are now level ${curLevel}.`);
    setTimeout(() => {
      if (!msg.deleted) msg.delete();
    }, 5000);

    const { rows } = await Client.sql.query('SELECT * FROM levelrole WHERE guildID = $1 AND level <= $2', [message.guild.id, curLevel]);
    if (rows.length !== 0) {
      let roleArr = [];
      rows.forEach(r => {
        if (!message.guild.roles.get(r.roleid)) {
          return Client.sql.query('DELETE FROM levelrole WHERE guildID = $1 AND roleID = $2', [message.guild.id, r.roleid]);
        }
        return roleArr.push(r.roleid);
      });

      if (roleArr.length === 1) {
        let sRole = message.guild.roles.get(roleArr[0]);
        if ((message.guild.me.hasPermission('MANAGE_ROLES') || message.guild.me.hasPermission('ADMINISTRATOR')) && sRole.position < message.guild.me.roles.highest.position && !message.member.roles.has(sRole.id)) {
          message.member.roles.add(sRole, 'Level Role');
        }
      } else if (roleArr.length > 1) {
        for (let i = 0; i < roleArr.length; i++) {
          let sRole = message.guild.roles.get(roleArr[i]);
          if ((message.guild.me.hasPermission('MANAGE_ROLES') || message.guild.me.hasPermission('ADMINISTRATOR')) && sRole.position < message.guild.me.roles.highest.position && !message.member.roles.has(sRole.id)) message.member.roles.add(sRole, 'Level Role');
        }
      }
    }
  } else {
    return Client.sql.query('UPDATE scores SET points = $1 WHERE userID = $2 AND guildID = $3', [curPoints, message.author.id, message.guild.id]);
  }
};
