import ReknownClient from '../../structures/client';
import { DMChannel, Message } from 'discord.js';

export async function run (client: ReknownClient, message: Message, args: string[]) {
  if (message.channel instanceof DMChannel) return message.reply('This command is only available in servers.');

  let music = client.music[message.guild!.id];
  if (!music) music = client.music[message.guild!.id] = {
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

export const help = {
  aliases: [],
  category: 'Music',
  desc: 'Toggles looping for music.',
  usage: 'loop [Toggle=on]'
};
