import type { GuildMessage } from '../../Constants';
import type { HelpObj } from '../../structures/CommandHandler';
import type { PermissionResolvable } from 'discord.js';
import type ReknownClient from '../../structures/Client';

export async function run (client: ReknownClient, message: GuildMessage, args: string[]) {
  await message.guild.members.fetch();

  const member = message.guild.members.cache.filter(m => !m.user.bot).random();
  message.reply({
    content: `Successfully randomly fetched ${member} **(${client.escMD(member.user.tag)})**!`,
    allowedMentions: {
      parse: []
    }
  });
}

export const help: HelpObj = {
  aliases: [ 'randomuser' ],
  category: 'Fun',
  desc: 'Gets a random member in a server.',
  togglable: true,
  usage: 'someone'
};

export const memberPerms: PermissionResolvable[] = [];

export const permissions: PermissionResolvable[] = [];
