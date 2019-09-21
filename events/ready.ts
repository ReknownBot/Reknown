import ReknownClient from '../structures/client';
import { PlayerManager } from 'discord.js-lavalink';

const nodes = [
  { host: 'localhost', port: 2333, password: 'youshallnotpass' }
];

module.exports.run = (client: ReknownClient) => {
  console.log(`Successfully logged in as ${client.user.tag} (${client.user.id}).`);
  client.user.setActivity({
    name: `${client.guilds.size} Servers`,
    type: 'WATCHING'
  });

  client.manager = new PlayerManager(client, nodes, {
    user: client.user.id,
    shards: 1
  });
};
