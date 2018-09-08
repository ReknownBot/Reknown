module.exports = (Client, message, args) => {
    return message.reply(`:ping_pong: Pong! \`${message.client.ping}ms\``);
}

module.exports.help = {
    name: 'ping',
    desc: 'Sends a pong!',
    category: 'misc',
    usage: '?ping',
    aliases: []
}