import { MessageEmbed } from 'discord.js';
import type ReknownClient from '../../structures/client';
import type { HelpObj, RowBiography } from 'ReknownBot';
import type { Message, PermissionString, TextChannel } from 'discord.js';
import { errors, tables } from '../../Constants';

const allowedFields = [
  'email',
  'summary',
  'twitter'
];

export async function run (client: ReknownClient, message: Message & { channel: TextChannel }, args: string[]) {
  if (args[1] && args[1].toLowerCase() === 'set') {
    if (!args[2]) return client.functions.noArg(message, 2, `a field to fill. It can be: ${allowedFields.join(', ')}.`);
    const field = args[2].toLowerCase();
    if (!allowedFields.includes(field)) return client.functions.badArg(message, 2, `The field provided is not available. Usable fields are: ${allowedFields.join(', ')}`);

    if (!args[3]) return client.functions.noArg(message, 3, 'a value for the field.');
    const value = args.slice(3).join(' ');

    client.functions.updateRow(client, tables.BIOGRAPHY, {
      [field]: value,
      userid: message.author.id
    }, {
      userid: message.author.id
    });
    message.channel.send(`Successfully updated your \`${field}\` to \`\`${client.escInline(value)}\`\`.`);
  } else {
    const member = args[1] ? await client.functions.parseMention(args[1], {
      guild: message.guild!,
      type: 'member'
    }) : message.member;
    if (!member) return client.functions.badArg(message, 1, errors.UNKNOWN_MEMBER);

    const row = await client.functions.getRow<RowBiography>(client, tables.BIOGRAPHY, {
      userid: member.id
    });
    if (!row) return client.functions.badArg(message, 1, 'The member provided did not provide any information about themselves.');

    const embed = new MessageEmbed()
      .setColor(client.config.embedColor)
      .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL())
      .setThumbnail(member.user.displayAvatarURL({ size: 512 }))
      .setTimestamp()
      .setTitle(`${member.user.tag}'s Biography`);

    if (row.email) embed.addField('Email', row.email, true);
    if (row.summary) embed.setDescription(row.summary);
    if (row.twitter) embed.addField('Twitter', row.twitter);

    message.channel.send(embed);
  }
}

export const help: HelpObj = {
  aliases: [ 'bio' ],
  category: 'Miscellaneous',
  desc: 'Checks a member\'s biography. Please note that any information set in this command is public to everyone that shares a server with you.',
  togglable: true,
  usage: 'biography [Member]\nbiography set <Field> <Value>'
};

export const memberPerms: PermissionString[] = [];

export const permissions: PermissionString[] = [
  'EMBED_LINKS'
];
