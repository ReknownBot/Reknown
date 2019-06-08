module.exports.run = async (client, message, args) => {
  const msg = await message.channel.send(`Pong! :heartbeat: \`${Math.round(client.ws.ping * 10) / 10}ms\``);
  return msg.edit(`${msg.content} :stopwatch: \`${Date.now() - msg.createdTimestamp}ms\``);
};

module.exports.help = {
  aliases: ['pong'],
  category: 'Miscellaneous',
  desc: 'Displays the ping of the bot.',
  usage: 'ping'
};
