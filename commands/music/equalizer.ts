import { ReknownClient } from "ReknownBot";
import { Message, DMChannel } from "discord.js";
import { EqualizerBand } from "lavalink";

module.exports.run = (client: ReknownClient, message: Message, args: string[]) => {
  if (message.channel instanceof DMChannel) return message.reply(':x: This command is only available in servers.');

  const music = client.music[message.guild.id];

  if (!music || !music.player || !music.player.playing) return message.reply(':x: I am not playing anything!');
  if (message.guild.voice.channelID !== message.member.voice.channelID) return message.reply(':x: You must be in the same voice channel as me to run that command.');

  if (!args[1]) return message.channel.send(`The current equalizer level is at \`${music.equalizer}\`.`);

  const eq = parseInt(args[0]);
  if (isNaN(eq)) return client.functions.badArg(message, 1, 'The provided equalizer was not a number.');
  if (eq < -3 || eq > 3) return client.functions.badArg(message, 1, `The maximum equalizer range is \`-3\` to \`3\`. Provided value: \`${eq}\``);

  let bands: EqualizerBand[] = [];
  for (let i = 0; i < 15; i++) {
    bands.push({
      band: i,
      gain: eq
    });
  }

  music.equalizer = eq;
  music.player.setEqualizer(bands);
  message.channel.send(`Successfully set the equalizer to \`${eq}\`.`);
};

module.exports.help = {
  aliases: [ 'eq' ],
  category: 'Music',
  desc: 'Displays or changes the equalizer.',
  usage: 'equalizer [New Equalizer]'
};
