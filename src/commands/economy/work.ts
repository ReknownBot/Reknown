import type ColumnTypes from '../../typings/ColumnTypes';
import type { HelpObj } from '../../structures/CommandHandler';
import type { Message } from 'discord.js';
import type ReknownClient from '../../structures/Client';
import ms from 'ms';
import { tables } from '../../Constants';
import { ColorResolvable, MessageEmbed, PermissionResolvable, Permissions } from 'discord.js';

export async function run (client: ReknownClient, message: Message, args: string[]) {
  let [ registered ] = await client.sql<ColumnTypes['ECONOMY'][]>`
    SELECT * FROM ${client.sql(tables.ECONOMY)}
      WHERE userid = ${message.author.id}
  `;
  if (!registered) registered = await client.functions.register(client, message.author.id);

  const [ cooldown ] = await client.sql<ColumnTypes['COOLDOWN'][]>`
    SELECT * FROM ${client.sql(tables.WORKCOOLDOWN)}
      WHERE userid = ${message.author.id}
  `;
  if (cooldown && Number(cooldown.endsat) >= Date.now()) return message.reply(`This command is still on cooldown! Please wait ${client.functions.getTime(Number(cooldown.endsat) - Date.now())}.`);
  
  const columns = {
    endsat: (Date.now() + ms('6h')).toString(),
    userid: message.author.id
  };
  client.sql`
    INSERT INTO ${client.sql(tables.WORKCOOLDOWN)} ${client.sql(columns)}
      ON CONFLICT (userid) DO UPDATE
        SET ${client.sql(columns)}
    RETURNING *
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
    RETURNING *
  `;

  const embed = new MessageEmbed()
    .setTitle('You finished working!')
    .setColor(client.config.embedColor as ColorResolvable)
    .setDescription(`You earned **$${amt}**.`)
    .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL())
    .setTimestamp();

  message.reply({ embeds: [ embed ]});
}

export const help: HelpObj = {
  aliases: [],
  category: 'Economy',
  desc: 'Works to get money.',
  dm: true,
  togglable: true,
  usage: 'work'
};

export const memberPerms: PermissionResolvable[] = [];

export const permissions: PermissionResolvable[] = [
  Permissions.FLAGS.EMBED_LINKS
];
