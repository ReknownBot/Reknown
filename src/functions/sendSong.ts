import * as config from '../config.json';
import { MusicObject } from 'ReknownBot';
import { Track } from 'lavalink';
import { ClientUser, DMChannel, Message, MessageEmbed, Util } from 'discord.js';

export function run (music: MusicObject, message: Message, song: Track, user: ClientUser) {
  if (message.channel instanceof DMChannel) return;
  if (!message.channel.permissionsFor(user)!.has('EMBED_LINKS')) {
    if (music.queue.length === 0) return message.channel.send(`**Now Playing:** ${Util.escapeMarkdown(song.info.title)} by \`${Util.escapeMarkdown(song.info.author)}\``);
    return message.channel.send(`**Added to Queue:** ${Util.escapeMarkdown(song.info.title)} by \`${Util.escapeMarkdown(song.info.author)}\``);
  }

  const embed = new MessageEmbed()
    .addField('Author', song.info.author)
    .addField('Duration', `${Math.round(song.info.length / 6000) / 10}m`)
    .setColor(config.embedColor)
    .setFooter(`Requested by ${message.author!.tag}`, message.author!.displayAvatarURL());
  if (music.queue.length === 0) embed.setAuthor(`Now Playing: ${song.info.title}`, undefined, song.info.uri);
  else embed.setAuthor(`Added to Queue: ${song.info.title}`, undefined, song.info.uri);

  const thumbnail = song.info.uri.includes('youtube') ? `https://i.ytimg.com/vi/${song.info.identifier}/hqdefault.jpg` : null;
  if (thumbnail) embed.setThumbnail(thumbnail);

  message.channel.send(embed);
}
