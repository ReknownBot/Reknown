module.exports.run = (id, guild, options) => {
  let parsedId;

  if (isNaN(id)) {
    if (!id.endsWith('>') || id.replace(/[<>@!&#]/g, '').length === 0) return;
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
