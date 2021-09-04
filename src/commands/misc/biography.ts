import type ColumnTypes from '../../typings/ColumnTypes';
import type { GuildMessage } from '../../Constants';
import type { HelpObj } from '../../structures/commandhandler';
import type ReknownClient from '../../structures/client';
import { ColorResolvable, MessageEmbed, PermissionResolvable, Permissions } from 'discord.js';
import { errors, tables } from '../../Constants';

const allowedFields = [
  'email',
  'summary',
  'twitter'
];

export async function run (client: ReknownClient, message: GuildMessage, args: string[]) {
  if (args[1] && args[1].toLowerCase() === 'set') {
    if (!args[2]) return client.functions.noArg(message, 2, `a field to fill. It can be: ${allowedFields.join(', ')}.`);
    const field = args[2].toLowerCase();
    if (!allowedFields.includes(field)) return client.functions.badArg(message, 2, `The field provided is not available. Usable fields are: ${allowedFields.join(', ')}`);

    if (!args[3]) return client.functions.noArg(message, 3, 'a value for the field.');
    const value = args.slice(3).join(' ');

    const columns = {
      [field]: value,
      userid: message.author.id
    };
    client.sql`
      INSERT INTO ${client.sql(tables.BIOGRAPHY)} ${client.sql(columns)}
        ON CONFLICT (userid) DO UPDATE
          SET ${client.sql(columns)}
    `;
    message.reply(`Successfully updated your \`${field}\` to \`\`${client.escInline(value)}\`\`.`);
  } else {
    const member = args[1] ?
      await client.functions.parseMention(args[1], {
        guild: message.guild,
        type: 'member'
      }) :
      message.member;
    if (!member) return client.functions.badArg(message, 1, errors.UNKNOWN_MEMBER);

    const [ row ] = await client.sql<ColumnTypes['BIOGRAPHY'][]>`
      SELECT * FROM ${client.sql(tables.BIOGRAPHY)}
        WHERE userid = ${member.id}
    `;
    if (!row) return client.functions.badArg(message, 1, 'The member provided did not provide any information about themselves.');

    const embed = new MessageEmbed()
      .setColor(client.config.embedColor as ColorResolvable)
      .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL())
      .setThumbnail(member.user.displayAvatarURL({ size: 512 }))
      .setTimestamp()
      .setTitle(`${member.user.tag}'s Biography`);

    if (row.email) embed.addField('Email', row.email, true);
    if (row.summary) embed.setDescription(row.summary);
    if (row.twitter) embed.addField('Twitter', row.twitter, true);

    message.reply({ embeds: [ embed ] });
  }
}

export const help: HelpObj = {
  aliases: [ 'bio' ],
  category: 'Miscellaneous',
  desc: 'Checks a member\'s biography. Please note that any information set in this command is public to everyone that shares a server with you.',
  togglable: true,
  usage: 'biography [Member]\nbiography set <Field> <Value>'
};

export const memberPerms: PermissionResolvable[] = [];

export const permissions: PermissionResolvable[] = [
  Permissions.FLAGS.EMBED_LINKS
];
