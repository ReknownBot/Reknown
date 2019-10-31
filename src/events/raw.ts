import ReknownClient from '../structures/client';

export async function run (client: ReknownClient, pk: any) {
  if (pk.t === 'VOICE_STATE_UPDATE') client.lavalink!.voiceStateUpdate(pk.d);
  if (pk.t === 'VOICE_SERVER_UPDATE') client.lavalink!.voiceServerUpdate(pk.d);
}
