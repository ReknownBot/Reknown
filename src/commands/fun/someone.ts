import { HelpObj } from 'ReknownBot';
import ReknownClient from '../../structures/client';
import { Message, PermissionString, TextChannel } from 'discord.js';

export async function run (client: ReknownClient, message: Message & { channel: TextChannel }, args: string[]) {
  let members = message.guild!.members;
  if (members.size !== message.guild!.memberCount) members = await message.guild!.members.fetch();

  const member = members.filter(m => !m.user.bot).random();
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
