module.exports = (Client) => {
  return Client.bot.on('error', console.error);
};
