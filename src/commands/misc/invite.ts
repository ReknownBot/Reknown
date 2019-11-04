import { HelpObj } from 'ReknownBot';
import { Message } from 'discord.js';
import ReknownClient from '../../structures/client';

export async function run (client: ReknownClient, message: Message, args: string[]) {
  message.channel.send('**Add Reknown to your Server**: <https://reknown.xyz/invite>');
}

export const help: HelpObj = {
  aliases: [ 'botinvite' ],
  category: 'Miscellaneous',
  desc: 'Provides you with the bot invite.',
  dm: true,
  usage: 'invite'
};
