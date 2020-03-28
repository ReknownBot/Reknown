import type { PermissionString } from 'discord.js';
import type ReknownClient from '../../structures/client';
import type { GuildMessage, HelpObj } from 'ReknownBot';

export async function run (client: ReknownClient, message: GuildMessage, args: string[]) {
  const music = client.music[message.guild.id];

  if (!music || !music.player || !music.player.playing && !music.player.paused) return message.reply('I am not playing anything.');

  let bool = !music.player.paused;
  if (args[1] && args[1].toLowerCase() !== 'auto') {
    if (![ 'on', 'off' ].includes(args[1].toLowerCase())) return client.functions.badArg(message, 1, 'The argument must be `on`, `off`, or `auto`.');
    bool = args[1].toLowerCase() === 'on';
  }

  if (music.player.paused === bool) return message.reply('The value is already set to that.');
  if (message.guild.voice!.channelID !== message.member.voice.channelID) return message.reply('You must be in the same voice channel as me to run that command.');

  music.player.pause(bool);
  message.channel.send(`Successfully set the paused to \`${bool}\`.`);
}

export const help: HelpObj = {
  aliases: [ 'pausemusic' ],
  category: 'Music',
  desc: 'Pauses the music.',
  togglable: true,
  usage: 'pause [Toggle=auto]'
};

export const memberPerms: PermissionString[] = [];

export const permissions: PermissionString[] = [];
