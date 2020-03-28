import type { GuildMessage } from '../../Constants';
import type { HelpObj } from '../../structures/commandhandler';
import type { PermissionString } from 'discord.js';
import type ReknownClient from '../../structures/client';

export async function run (client: ReknownClient, message: GuildMessage, args: string[]) {
  await message.guild.members.fetch();

  const member = message.guild.members.cache.filter(m => !m.user.bot).random();
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
