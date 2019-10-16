import { ReknownClient } from 'ReknownBot';
import { Message, DMChannel, MessageEmbed, Guild } from 'discord.js';
import { prefix } from '../../config.json';

const configs: { [ key: string ]: string } = {
  levelmodifier: 'The level modifier for levelling up.',
  logchannel: 'The channel to send logs to.',
  prefix: 'The prefix for bot commands.',
  togglelog: 'Toggle for the action log.',
  togglewelcome: 'Toggle for welcoming messages.'
};

const defaultValues: { [ key: string ]: [ string, number | string | false ] } = {
  levelmodifier: [ 'modifier', 1 ],
  logchannel: [ 'channelid', '#action-log' ],
  prefix: [ 'customprefix', prefix ],
  togglelog: [ 'bool', false ],
  togglewelcome: [ 'bool', false ]
};

const filters: { [ key: string ]: (value: any, client: ReknownClient, guild: Guild) => any } = {
  levelmodifier: (value: number): number | string[] => {
    if (isNaN(value) || value.toString().includes('.') || value < 1 || value > 5) return [ 'The value was not a number, was a decimal, or was out of range [1-5].' ];
    return value;
  },
  logchannel: (value: string, client, guild) => {
    const channel = client.functions.parseMention(value, { cType: 'text', guild: guild, type: 'channel' });
    if (!channel) return [ 'That channel does not exist or is not a text channel.' ];
    return channel.id;
  },
  prefix: (value: string): string | string[] => {
    if (value.length > 15) return [ 'The value was too long to be a prefix [15 characters].' ];
    return value;
  },
  togglelog: (value: string): boolean | string[] => {
    if (![ 'true', 'false' ].includes(value.toString())) return [ 'The value needs to be either `true` or `false`.' ];
    return Boolean(value);
  },
  togglewelcome: (value: string): boolean | string[] => {
    if (![ 'true', 'false' ].includes(value.toString())) return [ 'The value needs to be either `true` or `false`.' ];
    return Boolean(value);
  }
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

  const table = args[1].toLowerCase();
  if (!Object.keys(configs).includes(table)) return client.functions.badArg(message, 1, 'That configuration value does not exist.');
  const row = (await client.query(`SELECT * FROM ${table} WHERE guildid = $1`, [ message.guild!.id ])).rows[0];

  if (!args[2]) {
    const value: number | string | boolean = row ? row[Object.keys(row).find(r => r !== 'guildid')!] : defaultValues[table][1];

    return message.channel.send(`Current value for \`${table}\` is \`${client.escInline(value.toString())}\`.`);
  }

  let value = args.slice(2).join(' ');
  const filter = filters[table](value, client, message.guild!);
  if (filter instanceof Array) return client.functions.badArg(message, 2, filter[0]);
  value = filter;

  const newRow: { [ key: string ]: any } = { guildid: message.guild!.id };
  newRow[defaultValues[table][0]] = value;
  client.functions.updateRow(client, table, newRow, {
    guildid: message.guild!.id
  });

  return message.channel.send(`Successfully updated \`${table}\` to \`${client.escInline(value)}\`.`);
};

module.exports.help = {
  aliases: [ 'configuration' ],
  category: 'Miscellaneous',
  desc: 'Shows or changes configuration values for the server.',
  usage: 'config [Configuration] [Value]'
};
