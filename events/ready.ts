import ReknownClient from '../structures/client';

module.exports.run = (client: ReknownClient): void => {
  console.log(`Successfully logged in as ${client.user.tag} (${client.user.id}).`);
};
