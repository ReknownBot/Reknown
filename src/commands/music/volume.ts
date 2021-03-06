import type { GuildMessage } from '../../Constants';
import type { HelpObj } from '../../structures/commandhandler';
import type { PermissionString } from 'discord.js';
import type ReknownClient from '../../structures/client';

export async function run (client: ReknownClient, message: GuildMessage, args: string[]) {
  const music = client.music[message.guild.id];

  if (!music || !music.player || !music.player.playing) return message.reply('I am not playing anything!');
  if (message.guild.voice!.channelID !== message.member.voice.channelID) return message.reply('You must be in the same voice channel as me to run that command.');

  if (!args[1]) return message.channel.send(`The current volume is **${music.volume}**.`);

  const volume = parseInt(args[1]);
  if (isNaN(volume)) return client.functions.badArg(message, 1, 'The provided volume was not a number.');
  if (volume < 1 || volume > 300) return client.functions.badArg(message, 1, 'The allowed range for a volume is 1-300.');

  music.player.volume(volume);
  music.volume = volume;
  message.channel.send(`Successfully set the volume to **${volume}**.`);
}

export const help: HelpObj = {
  aliases: [ 'setvolume' ],
  category: 'Music',
  desc: 'Displays / Sets the volume.',
  togglable: true,
  usage: 'volume [New Volume]'
};

export const memberPerms: PermissionString[] = [];

export const permissions: PermissionString[] = [];
