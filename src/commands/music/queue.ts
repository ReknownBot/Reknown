import ReknownClient from '../../structures/client';
import { Message, MessageEmbed, TextChannel } from 'discord.js';

export async function run (client: ReknownClient, message: Message & { channel: TextChannel }, args: string[]) {
  const music = client.music[message.guild!.id];
  if (!music || !music.queue || music.queue.length === 0) return message.reply('The queue is empty.');

  if (!args[1] || args[1].toLowerCase() !== 'clear') {
    let msg: MessageEmbed | string;
    if (message.channel.permissionsFor(client.user!)!.has('EMBED_LINKS')) {
      let desc = music.queue.map((song, i) => `${i + 1}. [\`\`${client.escInline(song.info.title)}\`\`](${song.info.uri})`).join('\n');
      if (desc.length > 2048) desc = `${desc.slice(0, -3)}...`;

      msg = new MessageEmbed()
        .setColor(client.config.embedColor)
        .setDescription(desc)
        .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL())
        .setTitle('Current Queue');
    } else {
      msg = music.queue.map((song, i) => `${i + 1}. \`\`${client.escInline(song.info.title)}\`\``).join('\n');
      if (msg.length > 2048) msg = `${msg.slice(0, -3)}...`;
    }

    message.channel.send(msg);
  } else {
    music.queue = [ music.queue[0] ];
    message.channel.send('Successfully cleared the queue.');
  }
}

export const help = {
  aliases: [ 'q', 'songlist' ],
  category: 'Music',
  desc: 'Shows the queue.',
  usage: 'queue ["clear"]'
};
