module.exports.run = client => {
  return client.once('ready', () => {
    console.log(`Successfully logged in as ${client.user.tag} (${client.user.id}).`);
  });
};
