import type ReknownClient from '../../structures/client';
import { tables } from '../../Constants';
import type { HelpObj, RowEconomy } from 'ReknownBot';
import type { Message, PermissionString } from 'discord.js';

export async function run (client: ReknownClient, message: Message, args: string[]) {
  let row = await client.functions.getRow<RowEconomy>(client, tables.ECONOMY, {
    userid: message.author.id
  });
  if (!row) row = await client.functions.register(client, message.author.id);

  if (!args[1]) return client.functions.noArg(message, 1, 'an amount to gamble.');
  const amt = parseInt(args[1]);
  if (amt < 50) return client.functions.badArg(message, 1, 'You must gamble at least $50.');
  if (amt > row.balance) return client.functions.badArg(message, 1, 'You do not have enough money to gamble that amount.');

  const won = Math.random() < 0.5;
  client.functions.updateRow<RowEconomy>(client, tables.ECONOMY, {
    balance: won ? row.balance + amt : row.balance - amt,
    userid: message.author.id
  }, {
    userid: message.author.id
  });
  message.channel.send(won ? `**Success!** You have received **$${amt}**.` : `**Failure! $${amt}** has been taken from your balance.`);
}

export const help: HelpObj = {
  aliases: [],
  category: 'Economy',
  desc: 'Gambles an amount of money for a chance to win double.',
  dm: true,
  togglable: true,
  usage: 'gamble <Amount>'
};

export const memberPerms: PermissionString[] = [];

export const permissions: PermissionString[] = [
  'EMBED_LINKS'
];
