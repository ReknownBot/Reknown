import type ReknownClient from '../structures/client';

export async function run (client: ReknownClient, pk: any) {
  if (pk.t === 'VOICE_STATE_UPDATE') client.lavacord!.voiceStateUpdate(pk.d);
  if (pk.t === 'VOICE_SERVER_UPDATE') client.lavacord!.voiceServerUpdate(pk.d);
}
