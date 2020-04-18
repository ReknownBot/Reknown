import type ColumnTypes from '../../typings/ColumnTypes';
import type { HelpObj } from '../../structures/commandhandler';
import type ReknownClient from '../../structures/client';
import { tables } from '../../Constants';
import type { Message, PermissionString } from 'discord.js';

export async function run (client: ReknownClient, message: Message, args: string[]) {
  let [ row ] = await client.sql<ColumnTypes['ECONOMY']>`
    SELECT * FROM ${client.sql(tables.ECONOMY)}
      WHERE userid = ${message.author.id}
  `;
  if (!row) row = await client.functions.register(client, message.author.id);

  if (!args[1]) return client.functions.noArg(message, 1, 'an amount to gamble.');
  const amt = parseInt(args[1]);
  if (amt < 50) return client.functions.badArg(message, 1, 'You must gamble at least $50.');
  if (amt > row.balance) return client.functions.badArg(message, 1, 'You do not have enough money to gamble that amount.');

  const won = Math.random() < 0.5;

  const columns = {
    balance: won ? row.balance + amt : row.balance - amt,
    userid: message.author.id
  };
  client.sql<ColumnTypes['ECONOMY']>`
    INSERT INTO ${client.sql(tables.ECONOMY)} ${client.sql(columns)}
      ON CONFLICT (userid) DO UPDATE
        SET ${client.sql(columns)}
  `;
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
