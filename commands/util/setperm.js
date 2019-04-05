/**
 * @param {import('../../structures/client.js')} Client
 * @param {import('discord.js').Message} message
 * @param {String[]} args
*/
module.exports = async (Client, message, args) => {
  if (!await Client.checkPerms('setperm', 'misc', message.member)) return Client.functions.get('noCustomPerm')(message, 'misc.setperm');

  if (!args[1]) return message.reply('You have to provide a permission for me to allow / disallow a role!');
  const perm = args[1];
  let permCateg, permName;
  if (perm !== '*') {
    permCateg = args[1].toLowerCase().split('.')[0];
    permName = args[1].toLowerCase().split('.')[1];
    if (!Object.keys(Client.permissions).includes(permCateg)) return message.reply('The permission category you provided was invalid!');

    if (permName && !Object.keys(Client.permissions[permCateg]).includes(permName)) return message.reply('The permission name you provided was invalid!');
  }

  if (!args[2]) return message.reply('You have to provide a role to change permissions!');
  const role = Client.getObj(args[2], { guild: message.guild, type: 'role' });
  if (!role) return message.reply('The role you provided was invalid!');
  if (role.position >= message.member.roles.highest.position && message.member !== message.guild.owner) return message.reply('Your role position is not high enough for that role!');

  if (!args[3]) return message.reply('Please provide a boolean for the role. (True or False)');
  let bool = args[3].toLowerCase();
  if (bool !== 'true' && bool !== 'false') return message.reply('Your third argument is not "true" or "false"!');
  bool = bool === 'true' ? 1 : 0;

  if (perm === '*') {
    Object.values(Client.permissions).forEach(obj => {
      Object.keys(obj).forEach(async pName => {
        const pCategory = Object.keys(Client.permissions).find(key => Client.permissions[key] === obj);
        const exists = (await Client.sql.query('SELECT * FROM permissions WHERE roleid = $1 AND pcategory = $2 AND pname = $3 LIMIT 1', [role.id, pCategory, pName])).rows[0];
        if (exists) Client.sql.query('UPDATE permissions SET bool = $1 WHERE roleid = $2 AND pcategory = $3 AND pname = $4', [bool, role.id, pCategory, pName]);
        else Client.sql.query('INSERT INTO permissions (roleid, pcategory, pname, bool) VALUES ($1, $2, $3, $4)', [role.id, pCategory, pName, bool]);
      });
    });

    return message.channel.send(`Successfully set all of ${role.name}'s permissions to ${bool ? 'true' : 'false'}.`);
  } else if (!permName) {
    Object.keys(Client.permissions[permCateg]).forEach(async pName => {
      const exists = (await Client.sql.query('SELECT * FROM permissions WHERE roleid = $1 AND pcategory = $2 AND pname = $3 LIMIT 1', [role.id, permCateg, pName])).rows[0];
      if (exists) Client.sql.query('UPDATE permissions SET bool = $1 WHERE roleid = $2 AND pcategory = $3 AND pname = $4', [bool, role.id, permCateg, pName]);
      else Client.sql.query('INSERT INTO permissions (roleid, pcategory, pname, bool) VALUES ($1, $2, $3, $4)', [role.id, permCateg, pName, bool]);
    });

    return message.channel.send(`Successfully ${bool ? 'enabled' : 'disabled'} all of ${permCateg}'s permissions for ${role.name}.`);
  } else {
    const exists = (await Client.sql.query('SELECT * FROM permissions WHERE roleid = $1 AND pcategory = $2 AND pname = $3 LIMIT 1', [role.id, permCateg, permName])).rows[0];
    if (exists) Client.sql.query('UPDATE permissions SET bool = $1 WHERE roleid = $2 AND pcategory = $3 AND pname = $4', [bool, role.id, permCateg, permName]);
    else Client.sql.query('INSERT INTO permissions (roleid, pcategory, pname, bool) VALUES ($1, $2, $3, $4)', [role.id, permCateg, permName, bool]);

    return message.channel.send(`Successfully set ${role.name}'s permission \`${permCateg}.${permName}\` to ${bool ? 'true' : 'false'}.`);
  }
};

module.exports.help = {
  name: 'setperm',
  desc: 'Sets the permissions for a role. Use the guild ID to set permissions for `@everyone`. (Custom bot permissions)',
  category: 'util',
  usage: '?setperm <Permission Category[.<Permission Name>]> <Role> <True or False>',
  aliases: []
};
