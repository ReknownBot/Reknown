import { ReknownClient } from 'ReknownBot';
import { Message, DMChannel, MessageEmbed } from 'discord.js';

module.exports.run = (client: ReknownClient, message: Message, args: string[]) => {
  if (message.channel instanceof DMChannel) return message.reply(':x: This command is only available in servers.');

  const music = client.music[message.guild.id];
  if (!music || !music.queue || music.queue.length === 0) return message.reply(':x: The queue is empty.');

  let msg: MessageEmbed | string;
  if (message.channel.permissionsFor(client.user).has('EMBED_LINKS')) {
    let desc = music.queue.map((song, i) => `${i + 1}. [\`${client.escMD(song.info.title)}\`](${client.escMD(song.info.uri)})`).join(' ');
    if (desc.length > 2048) desc = `${desc.slice(0, -3)}...`;

    msg = new MessageEmbed()
      .setColor(client.config.embedColor)
      .setDescription(desc)
      .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL())
      .setTitle('Current Queue');
  } else {
    msg = music.queue.map((song, i) => `${i + 1}. \`${client.escMD(song.info.title)}\``).join(' ');
    if (msg.length > 2048) msg = `${msg.slice(0, -3)}...`;
  }

  message.channel.send(msg);
};

module.exports.help = {
  aliases: [ 'songlist' ],
  category: 'Music',
  desc: 'Shows the queue.',
  usage: 'queue'
};
