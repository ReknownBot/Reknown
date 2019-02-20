module.exports = async (Client, message, args) => {
  const toggled = (await Client.sql.query('SELECT * FROM toggletickets WHERE guildid = $1 AND bool = $2', [message.guild.id, 1])).rows[0];
  if (!toggled) return message.reply('The ticket system is disabled!');

  if (message.guild.channels.find(chan => chan.topic === message.author.id && chan.type === 'text')) return message.reply('You already have a ticket open! Please close that one first.');
  const channelRow = (await Client.sql.query('SELECT * FROM ticketcategory WHERE guildid = $1', [message.guild.id])).rows[0];
  const category = channelRow ? message.guild.channels.find(chan => chan.type === 'category' && chan.id === channelRow.channelid) : null;
  if (category === undefined) return message.reply('The category set to put tickets in was invalid. Please recalibrate it.');
  if (category && !Client.checkClientPerms(category, 'MANAGE_CHANNELS')) return message.reply('I do not have enough permissions to create a ticket channel!');
  console.log(category);
  const channel = await message.guild.channels.create(`ticket-${message.author.tag}`, {
    topic: message.author.id,
    parent: category
  });
  if (category) await channel.lockPermissions();
  channel.createOverwrite(message.member, {
    VIEW_CHANNEL: true,
    SEND_MESSAGES: true
  });
  return message.channel.send(`Successfully created a ticket! Your ticket channel is ${channel}.`);
};

module.exports.help = {
  name: 'new',
  desc: 'Creates a ticket.',
  category: 'util',
  usage: '?new',
  aliases: ['ticket']
};
