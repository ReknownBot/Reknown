module.exports = async (Client, message, args) => {
  const userTag = message.guild.members.random().user.tag;
  return message.channel.send(`${userTag}, You have been @someone'd!`);
};

module.exports.help = {
  name: 'someone',
  desc: 'Gets a random user and displays their tag.',
  category: 'fun',
  usage: '?someone',
  aliases: []
};
