import type { HelpObj } from '../../structures/commandhandler';
import type ReknownClient from '../../structures/client';
import type { Message, PermissionResolvable } from 'discord.js';

export async function run (client: ReknownClient, message: Message, args: string[]) {
  message.reply('**Add Reknown to your Server**: <https://reknown.xyz/invite>');
}

export const help: HelpObj = {
  aliases: [ 'botinvite' ],
  category: 'Miscellaneous',
  desc: 'Provides you with the bot invite.',
  dm: true,
  togglable: false,
  usage: 'invite'
};

export const memberPerms: PermissionResolvable[] = [];

export const permissions: PermissionResolvable[] = [];
