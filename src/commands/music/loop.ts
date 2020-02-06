import type { PermissionString } from 'discord.js';
import type ReknownClient from '../../structures/client';
import type { GuildMessage, HelpObj } from 'ReknownBot';

export async function run (client: ReknownClient, message: GuildMessage, args: string[]) {
  let music = client.music[message.guild.id];
  if (!music) music = client.music[message.guild.id] = {
    equalizer: 0,
    looping: false,
    player: undefined,
    queue: [],
    volume: 20
  };
  const bool = args[1] ? args[1].toLowerCase() === 'on' : !music.looping;
  if (!bool && args[1] && args[1].toLowerCase() !== 'off') return client.functions.badArg(message, 1, 'This must be either "on" or "off".');
  music.looping = bool;

  message.channel.send(`Successfully toggled looping ${bool ? 'on' : 'off'}.`);
}

export const help: HelpObj = {
  aliases: [],
  category: 'Music',
  desc: 'Toggles looping for music.',
  togglable: true,
  usage: 'loop [Toggle=on]'
};

export const memberPerms: PermissionString[] = [];

export const permissions: PermissionString[] = [];
