import type { HelpObj } from 'ReknownBot';
import { MessageEmbed } from 'discord.js';
import type ReknownClient from '../../structures/client';
import fetch from 'node-fetch';
import { stringify } from 'querystring';
import type { Message, PermissionString } from 'discord.js';

interface UUIDJson {
  id: string;
  name: string;
}

const hypixelEndpoint = 'https://api.hypixel.net';
const minecraftEndpoint = 'https://api.mojang.com';

const REVERSE_PQ_PREFIX = -3.5;
const REVERSE_CONST = 12.25;
const GROWTH_DIVIDES_2 = 0.0008;

let ratelimit = 0;

export async function run (client: ReknownClient, message: Message, args: string[]) {
  if (ratelimit >= 115) return message.reply('I am getting close to the ratelimit for the Hypixel API. Please try again in a moment.');
  if (!args[1]) return client.functions.noArg(message, 1, 'a type of statistic to look up, it can be: player.');
  if (!args[2]) return client.functions.noArg(message, 2, 'a value to search by.');

  switch (args[1].toLowerCase()) {
    case 'player': {
      const uuidRes = await fetch(`${minecraftEndpoint}/users/profiles/minecraft/${args[2]}`);
      const uuidJson: UUIDJson | null = await uuidRes.json().catch(() => null);
      if (!uuidJson) return client.functions.badArg(message, 1, 'That Minecraft player does not exist.');
      const uuid = uuidJson.id;

      const queries = stringify({
        key: process.env.HYPIXEL_KEY,
        uuid: uuid
      });
      const hypixelJson: { success: boolean; player: any } = await fetch(`${hypixelEndpoint}/player?${queries}`).then(res => res.json());
      ratelimit += 1;
      setTimeout(() => ratelimit -= 1, 60000);
      if (!hypixelJson.success) return client.functions.badArg(message, 2, 'That player has not joined the server yet, or the request has failed.');
      const { player } = hypixelJson;
      const level = player.networkExp < 0 ? 1 : Math.floor(1 + REVERSE_PQ_PREFIX + Math.sqrt(REVERSE_CONST + GROWTH_DIVIDES_2 * player.networkExp));
      const embed = new MessageEmbed()
        .addFields([
          {
            inline: true,
            name: 'Network XP',
            value: `${client.functions.formatNum(player.networkExp || 0)} (Level: ${client.functions.formatNum(level)})`
          },
          {
            inline: true,
            name: 'Karma',
            value: client.functions.formatNum(player.karma || 0)
          },
          {
            inline: true,
            name: 'Achievement Points',
            value: client.functions.formatNum(player.achievementPoints || 0)
          },
          {
            inline: true,
            name: 'Total Votes',
            value: client.functions.formatNum(player.voting ? player.voting.total : 0)
          },
          {
            inline: true,
            name: 'Pet Food Count',
            value: client.functions.formatNum(Object.values(player.petConsumables as number || { temp: 0 }).reduce((a, b) => a + b, 0))
          }
        ])
        .setColor(client.config.embedColor)
        .setAuthor(`General Stats for ${player.displayname}`, undefined, `https://hypixel.net/player/${player.displayname}`);

      message.channel.send(embed);
      break;
    }

    // no default
  }
}

export const help: HelpObj = {
  aliases: [],
  category: 'Fun',
  desc: 'Gets a variety of stats from the Minecraft server [Hypixel](https://hypixel.net/).',
  dm: true,
  togglable: true,
  usage: 'hypixel <"player"> <In-Game Name>'
};

export const memberPerms: PermissionString[] = [];

export const permissions: PermissionString[] = [
  'EMBED_LINKS'
];
