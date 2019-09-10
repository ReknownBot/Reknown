module.exports.run = (client, message, args) => {
  return message.channel.send(`**Add Reknown to your Server**: <https://discordapp.com/oauth2/authorize?client_id=${client.user.id}&scope=bot>`);
};

module.exports.help = {
  aliases: [ 'botinvite' ],
  category: 'Miscellaneous',
  desc: 'Provides you with the bot invite.',
  usage: 'invite'
};
