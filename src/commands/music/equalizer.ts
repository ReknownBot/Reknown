import type { GuildMessage } from '../../Constants';
import type { HelpObj } from '../../structures/commandhandler';
import type { PermissionString } from 'discord.js';
import type { PlayerEqualizerBand } from 'lavacord';
import type ReknownClient from '../../structures/client';

export async function run (client: ReknownClient, message: GuildMessage, args: string[]) {
  const music = client.music[message.guild.id];

  if (!music || !music.player || !music.player.playing) return message.reply('I\'m not playing anything!');
  if (message.guild.voice!.channelID !== message.member.voice.channelID) return message.reply('You must be in the same voice channel as me to run that command.');

  if (!args[1]) return message.channel.send(`The current equalization level is at \`${music.equalizer}\`.`);
  let eq = parseInt(args[1]);
  if (isNaN(eq)) return client.functions.badArg(message, 1, 'The provided value was not a number.');
  if (eq < -3 || eq > 3) return client.functions.badArg(message, 1, `The maximum equalizer range is \`-3\` to \`3\`. Provided value: \`${eq}\``);
  eq /= 100;

  const bands: PlayerEqualizerBand[] = [];
  for (let i = 0; i < 15; i++) {
    const gain = eq * (7 - i) * -1;

    bands.push({
      band: i,
      gain: gain
    });
  }

  music.equalizer = eq;
  music.player.equalizer(bands);
  message.channel.send(`Successfully set the value to \`${eq * 100}\`. Please wait a couple seconds for it to update.`);
}

export const help: HelpObj = {
  aliases: [ 'eq' ],
  category: 'Music',
  desc: 'Displays or changes the equalizer.',
  togglable: true,
  usage: 'equalizer [New Equalizer]'
};

export const memberPerms: PermissionString[] = [];

export const permissions: PermissionString[] = [];
