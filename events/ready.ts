import ReknownClient from '../structures/client';

module.exports.run = (client: ReknownClient) => {
  console.log(`Successfully logged in as ${client.user.tag} (${client.user.id}).`);
  client.user.setActivity({
    name: `${client.guilds.size} Servers`,
    type: 'WATCHING'
  });
};
