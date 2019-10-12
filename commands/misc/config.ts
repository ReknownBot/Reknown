import { ReknownClient } from 'ReknownBot';
import { Message, DMChannel, MessageEmbed } from 'discord.js';
import { prefix } from '../../config.json';

const configs: { [ key: string ]: string } = {
  levelmodifier: 'The level modifier for levelling up.',
  prefix: 'The prefix for bot commands.',
  togglelog: 'Toggle for the action log.',
  togglewelcome: 'Toggle for welcoming messages.'
};

const defaultValues: { [ key: string ]: any } = {
  levelmodifier: [ 'modifier', 1 ],
  prefix: [ 'customprefix', prefix ],
  togglelog: [ 'bool', false ],
  togglewelcome: [ 'bool', false ]
};

const filters: { [ key: string ]: Function } = {
  levelmodifier: (value: number): true | string => !isNaN(value) && value > 0 && value < 6 || 'The value was not a number, or it was out of range [1-5].',
  prefix: (value: string): true | string => value.length < 16 || 'The value was too long to be a prefix [15 characters].',
  togglelog: (value: string): true | string => [ 'true', 'false' ].includes(value.toString()) || 'The value needs to be either `true` or `false`.',
  togglewelcome: (value: string): true | string => [ 'true', 'false' ].includes(value.toString()) || 'The value needs to be either `true` or `false`.'
};

module.exports.run = async (client: ReknownClient, message: Message, args: string[]) => {
  if (message.channel instanceof DMChannel) return message.reply(':x: This command is only available in servers.');

  if (!args[1]) {
    if (!message.channel.permissionsFor(client.user!)!.has('EMBED_LINKS')) return client.functions.noClientPerms(message, [ 'Embed Links' ], message.channel);

    const embed = new MessageEmbed()
      .setColor(client.config.embedColor)
      .setDescription(Object.keys(configs).map(name => `\`${name}\` - ${configs[name]}`).join('\n'))
      .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL())
      .setTimestamp()
      .setTitle('Configuration Values');

    return message.channel.send(embed);
  }

  const table = args[2].toLowerCase();
  if (!Object.keys(configs).includes(table)) return client.functions.badArg(message, 1, 'That configuration value does not exist.');
  const row = (await client.query(`SELECT * FROM ${table} WHERE guildid = $1`, [ message.guild!.id ])).rows[0];

  if (!args[2]) {
    const value = row ? row[Object.keys(row).find(r => r !== 'guildid')!] : defaultValues[table][1];

    return message.channel.send(`Current value for \`${table}\` is \`${client.escMD(value)}\`.`);
  }

  const value = args.slice(2).join(' ');
  if (filters[table](value) !== true) return client.functions.badArg(message, 2, filters[table](value));

  const newRow: { [ key: string ]: any } = { guildid: message.guild!.id };
  newRow[defaultValues[table][0]] = value;
  client.functions.updateRow(client, table, newRow, {
    guildid: message.guild!.id
  });

  return message.channel.send(`Successfully updated \`${table}\` to \`${client.escMD(value)}\`.`);
};

module.exports.help = {
  aliases: [ 'configuration' ],
  category: 'Miscellaneous',
  desc: 'Shows or changes configuration values for the server.',
  usage: 'config [Configuration] [Value]'
};
