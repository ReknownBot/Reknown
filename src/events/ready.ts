import { Node } from 'lavalink';
import ReknownClient from '../structures/client';

export async function run (client: ReknownClient) {
  console.log(`Successfully logged in as ${client.user!.tag} (${client.user!.id}).`);
  client.user!.setActivity({
    name: `${client.guilds.size} Servers`,
    type: 'WATCHING'
  });

  client.lavalink = new Node({
    password: process.env.LAVALINK_PASS!,
    userID: client.user!.id,
    host: 'localhost:2333',
    send: function (guild, packet) {
      if (client.guilds.has(guild)) return client.ws.shards.first()!.send(packet);
    },
  });
}
