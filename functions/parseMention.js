const regexArr = [ /<@!?(\d{17,19})>/, /<@&(\d{17,19})>/, /<#(\d{17,19})>/ ];

module.exports = (id, guild, options) => {
  if (isNaN(id) && !regexArr.some(regex => regex.test(id))) return Promise.reject(false);

  let parsedId;
  if (isNaN(id)) {
    parsedId = id.slice(2, -1);
    if (id.startsWith('<@!') || id.startsWith('<@&')) parsedId = id.slice(3, -1);
  } else parsedId = id;
  const cType = options.cType || 'text';

  switch (options.type) {
    case 'member': return guild.members.fetch(parsedId);
    case 'user': return options.client.users.fetch(parsedId);
    case 'role': return guild.roles.get(parsedId) || false;
    case 'channel': return guild.channels.find(c => c.id === parsedId && c.type === cType) || false;
    default: return null;
  }
};
