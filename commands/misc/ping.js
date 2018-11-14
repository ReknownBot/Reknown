module.exports = (Client, message, args) => {
  return message.channel.send(`:ping_pong: Pong! \`${message.client.ws.ping}ms\``);
};

module.exports.help = {
  name: 'ping',
  desc: 'Sends a pong!',
  category: 'misc',
  usage: '?ping',
  aliases: []
};
