import type ReknownClient from '../../structures/client';
import type { HelpObj, RowEconomy } from 'ReknownBot';
import type { Message, PermissionString } from 'discord.js';
import { errors, tables } from '../../Constants';

export async function run (client: ReknownClient, message: Message, args: string[]) {
  const user = args[1] ?
    await client.functions.parseMention(args[1], {
      client: client,
      type: 'user'
    }) :
    message.author;
  if (!user) return client.functions.badArg(message, 1, errors.UNKNOWN_USER);

  const row = await client.functions.getRow<RowEconomy>(client, tables.ECONOMY, {
    userid: user.id
  });
  if (!row || row.balance === 0) return message.reply('That user does not have a registered account or has no money.');

  message.channel.send(`${user.tag} has **$${row.balance}**.`);
}

export const help: HelpObj = {
  aliases: [ 'bal', 'money' ],
  category: 'Economy',
  desc: 'Displays a user\'s balance.',
  dm: true,
  togglable: true,
  usage: 'balance [User]'
};

export const memberPerms: PermissionString[] = [];

export const permissions: PermissionString[] = [];
