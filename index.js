require('array-utility');
require('dotenv').config();

// test

const Client = require('./structures/client.js');

process.on('unhandledRejection', error => {
  console.error(error);
  return Client.rollbar.error(error);
});

Client.bot.login(process.env.BOT_TOKEN);
