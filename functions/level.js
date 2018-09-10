module.exports = async (Client, message) => {
  // Checks if the guild has leveling enabled.
  const toggleLevel = (await Client.sql.query('SELECT * FROM toggleLevel WHERE guildId = $1 LIMIT 1', [message.guild.id])).rows[0];
  if (!toggleLevel || !toggleLevel.bool) return;

  // Gets the amount of scores the user has
  const scoreCount = (await Client.sql.query('SELECT * FROM scores WHERE userID = $1 AND guildID = $2 LIMIT 1', [message.author.id, message.guild.id])).rows[0];
  // If there is no row, insert one
  if (!scoreCount) return Client.sql.query('INSERT INTO scores (userID, guildID, points, level) VALUES ($1, $2, $3, $4)', [message.author.id, message.guild.id, 1, 0]);

  // Gets the current level
  const curLevel = Math.floor(0.2 * Math.sqrt(scoreCount.points + message.content.length));
  // Gets the current score
  const curPoints = message.content.length + scoreCount.points;
  // If the new level is bigger than the older one i.e leveled up
  if (curLevel > scoreCount.level) {
    Client.sql.query('UPDATE scores SET level = $1, points = $2 WHERE userID = $3 AND guildID = $4', [curLevel, curPoints, message.author.id, message.guild.id]);
    let msg = await message.channel.send(`GG ${message.author}! You are now level ${curLevel}.`);
    setTimeout(() => {
      if (!msg.deleted) msg.delete();
    }, 5000);

    // Gets all the level roles for the guild for the level
    const { rows } = await Client.sql.query('SELECT * FROM levelrole WHERE guildID = $1 AND level <= $2', [message.guild.id, curLevel]);
    // If there is one or more roles to give
    if (rows.length !== 0) {
      // Defines "roleArr" as an array
      let roleArr = [];
      // Starts a loop based on the roles
      rows.forEach(r => {
        // If the role was deleted
        if (!message.guild.roles.get(r.roleid)) {
          // Delete it from the database to save spacae
          return Client.sql.query('DELETE FROM levelrole WHERE guildID = $1 AND roleID = $2', [message.guild.id, r.roleid]);
        }
        // Pushes the role ID to the array that was created earlier
        return roleArr.push(r.roleid);
      });

      // If there is only one role to give
      if (roleArr.length === 1) {
        // Defines "sRole" as the role to give
        let sRole = message.guild.roles.get(roleArr[0]);
        // Checks for permissions and if the member already has the role.
        if ((message.guild.me.hasPermission('MANAGE_ROLES') || message.guild.me.hasPermission('ADMINISTRATOR')) && sRole.position < message.guild.me.roles.highest.position && !message.member.roles.has(sRole.id)) {
          // Adds the role
          message.member.roles.add(sRole, 'Level Role');
        }
        // If there is more than one role to give
      } else if (roleArr.length > 1) {
        // Makes a loop for the roles
        for (let i = 0; i < roleArr.length; i++) {
          // Defines "sRole" as the role to give
          let sRole = message.guild.roles.get(roleArr[i]);
          // Checks for permissions and if the member already has the role
          if ((message.guild.me.hasPermission('MANAGE_ROLES') || message.guild.me.hasPermission('ADMINISTRATOR')) && sRole.position < message.guild.me.roles.highest.position && !message.member.roles.has(sRole.id)) {
            // Adds the role
            message.member.roles.add(sRole, 'Level Role');
          }
        }
      }
    }
    // If the user did not level up
  } else {
    // Updates the points
    return Client.sql.query('UPDATE scores SET points = $1 WHERE userID = $2 AND guildID = $3', [curPoints, message.author.id, message.guild.id]);
  }
};
