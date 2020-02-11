import type { PermissionString } from 'discord.js';
import type ReknownClient from '../../structures/client';
import type { GuildMessage, HelpObj } from 'ReknownBot';

export async function run (client: ReknownClient, message: GuildMessage, args: string[]) {
  let members = message.guild.members;
  if (members.cache.size !== message.guild.memberCount) members = await message.guild.members.fetch();

  const member = members.cache.filter(m => !m.user.bot).random();
  message.channel.send(`Successfully randomly fetched **${client.escMD(member.user.tag)}**!`);
}

export const help: HelpObj = {
  aliases: [ 'randomuser' ],
  category: 'Fun',
  desc: 'Gets a random member in a server.',
  togglable: true,
  usage: 'someone'
};

export const memberPerms: PermissionString[] = [];

export const permissions: PermissionString[] = [];
