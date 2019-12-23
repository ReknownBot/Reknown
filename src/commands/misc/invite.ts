import { HelpObj } from 'ReknownBot';
import ReknownClient from '../../structures/client';
import { Message, PermissionString } from 'discord.js';

export async function run (client: ReknownClient, message: Message, args: string[]) {
  message.channel.send('**Add Reknown to your Server**: <https://reknown.xyz/invite>');
}

export const help: HelpObj = {
  aliases: [ 'botinvite' ],
  category: 'Miscellaneous',
  desc: 'Provides you with the bot invite.',
  dm: true,
  togglable: false,
  usage: 'invite'
};

export const memberPerms: PermissionString[] = [];

export const permissions: PermissionString[] = [];
