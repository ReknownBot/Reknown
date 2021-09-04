import type ColumnTypes from '../../typings/ColumnTypes';
import type { HelpObj } from '../../structures/commandhandler';
import type ReknownClient from '../../structures/client';
import ms from 'ms';
import { tables } from '../../Constants';
import type { Message, PermissionResolvable } from 'discord.js';

export async function run (client: ReknownClient, message: Message, args: string[]) {
  let [ registered ] = await client.sql<ColumnTypes['ECONOMY'][]>`
    SELECT * FROM ${client.sql(tables.ECONOMY)}
      WHERE userid = ${message.author.id}
  `;
  if (!registered) registered = await client.functions.register(client, message.author.id);

  const [ cooldown ] = await client.sql<ColumnTypes['COOLDOWN'][]>`
    SELECT * FROM ${client.sql(tables.DAILYCOOLDOWN)}
      WHERE userid = ${message.author.id}
  `;
  if (cooldown && Number(cooldown.endsat) >= Date.now()) return message.reply(`This command is still on cooldown! Please wait ${client.functions.getTime(Number(cooldown.endsat) - Date.now())}.`);

  const columns = {
    endsat: Date.now() + ms('16h'),
    userid: message.author.id
  };
  client.sql`
    INSERT INTO ${client.sql(tables.DAILYCOOLDOWN)} ${client.sql(columns)}
      ON CONFLICT (userid) DO UPDATE
        SET ${client.sql(columns)}
  `;

  const amt = Math.floor(Math.random() * 101) + 100;

  const columns1 = {
    balance: registered.balance + amt,
    userid: message.author.id
  };
  client.sql`
    INSERT INTO ${client.sql(tables.ECONOMY)} ${client.sql(columns1)}
      ON CONFLICT (userid) DO UPDATE
        SET ${client.sql(columns1)}
  `;

  message.reply(`You earned **$${amt}** from daily rewards.`);
}

export const help: HelpObj = {
  aliases: [],
  category: 'Economy',
  desc: 'Gets your daily money.',
  dm: true,
  togglable: true,
  usage: 'daily'
};

export const memberPerms: PermissionResolvable[] = [];

export const permissions: PermissionResolvable[] = [];
