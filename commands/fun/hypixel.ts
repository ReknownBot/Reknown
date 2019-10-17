import { ReknownClient } from 'ReknownBot';
import { Message, TextChannel, MessageEmbed } from 'discord.js';
import fetch from 'node-fetch';
import { stringify } from 'querystring';
import { Player } from 'Hypixel-API';

interface UUIDJson {
  id: string;
  name: string;
}

const hypixelEndpoint = 'https://api.hypixel.net';
const minecraftEndpoint = 'https://api.mojang.com';

let ratelimit = 0;

module.exports.run = async (client: ReknownClient, message: Message, args: string[]) => {
  if (message.channel instanceof TextChannel && !message.channel.permissionsFor(client.user!)!.has('EMBED_LINKS')) return client.functions.noClientPerms(message, [ 'Embed Links' ], message.channel);

  if (ratelimit >= 115) return message.reply('I am getting close to the ratelimit for the Hypixel API. Please try again in a moment.');
  if (!args[1]) return client.functions.noArg(message, 1, 'a type of statistic to look up, it can be: player.');
  if (!args[2]) return client.functions.noArg(message, 2, 'a value to search by.');

  switch (args[1].toLowerCase()) {
    case 'player': {
      const uuidRes = await fetch(`${minecraftEndpoint}/users/profiles/minecraft/${args[2]}`);
      const uuidJson: UUIDJson | false = await uuidRes.json().catch(() => false);
      if (uuidJson === false) return client.functions.badArg(message, 1, 'That Minecraft player does not exist.');
      const uuid = uuidJson.id;

      const queries = stringify({
        key: process.env.HYPIXEL_KEY,
        uuid: uuid
      });
      const hypixelJson: { success: boolean; player: Player } = await fetch(`${hypixelEndpoint}/player?${queries}`).then(res => res.json());
      ratelimit += 1;
      setTimeout(() => ratelimit -= 1, 60000);
      if (!hypixelJson.success) return client.functions.badArg(message, 2, 'That player has not joined the server yet, or the request has failed.');
      const { player } = hypixelJson;
      const embed = new MessageEmbed()
        .addField('Network XP', client.functions.formatNum(player.networkExp || 0), true)
        .addField('Karma', client.functions.formatNum(player.karma || 0), true)
        .addField('Achievement Points', client.functions.formatNum(player.achievementPoints || 0), true)
        .addField('Total Votes', client.functions.formatNum(player.voting ? player.voting.total : 0), true)
        .addField('Pet Food Count', client.functions.formatNum(Object.values(player.petConsumables || { temp: 0 }).reduce((a, b) => a + b, 0)), true)
        .setColor(client.config.embedColor)
        .setAuthor(`General Stats for ${player.displayname}`, undefined, `https://hypixel.net/player/${player.displayname}`);

      message.channel.send(embed);
      break;
    }

    // no default
  }
};

module.exports.help = {
  aliases: [],
  category: 'Fun',
  desc: 'Gets a variety of stats from the Minecraft server [Hypixel](https://hypixel.net/).',
  usage: 'hypixel <"player"> <In-Game Name>'
};
