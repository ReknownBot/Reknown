async function logMessage (Client, oldMessage, newMessage) {
  if (!oldMessage.content && !newMessage.content) return;
  if (oldMessage.content === newMessage.content) return;

  const embed = new Client.Discord.MessageEmbed()
    .setTitle('Message Edited')
    .setAuthor(`${oldMessage.author.tag} (${oldMessage.author.id})`, oldMessage.author.displayAvatarURL())
    .addField('Previous', oldMessage.content ? oldMessage.content.length > 1024 ? 'Over 1024 Char.' : oldMessage.content : 'None')
    .addField('After', newMessage.content ? newMessage.content.length > 1024 ? 'Over 1024 Char.' : newMessage.content : 'None')
    .addField('Channel', oldMessage.content)
    .setColor(0x00FFFF)
    .setTimestamp();

  return require('../functions/sendlog.js')(Client, embed, oldMessage.guild.id);
}

async function editMsg (Client, oldMessage, newMessage) {
  return Client.bot.emit('message', newMessage);
}

module.exports = async (Client, oldMessage, newMessage) => {
  if (!oldMessage.guild || !oldMessage.guild.available) return;

  logMessage(Client, oldMessage, newMessage);
  editMsg(Client, oldMessage, newMessage);
};
