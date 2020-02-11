import { MessageEmbed } from 'discord.js';
import type ReknownClient from '../../structures/client';
import { prefix } from '../../config.json';
import type { Guild, PermissionString } from 'discord.js';
import type { GuildMessage, HelpObj } from 'ReknownBot';

const configs: { [ key: string ]: string } = {
  levelmodifier: 'The level modifier for levelling up.',
  logchannel: 'The channel to send logs to.',
  muterole: 'The name of the role to use when muting members.',
  prefix: 'The prefix for bot commands.',
  starchannel: 'The channel to send starboard messages to.',
  togglelog: 'Toggle for the action log.',
  togglestar: 'Toggle for starboard messages.',
  togglewelcome: 'Toggle for welcoming messages.'
};

const defaultValues: { [ key: string ]: [ string, number | string | false ] } = {
  levelmodifier: [ 'modifier', 1 ],
  logchannel: [ 'channelid', '#action-log' ],
  muterole: [ 'rolename', 'Muted' ],
  prefix: [ 'customprefix', prefix ],
  starchannel: [ 'channelid', '#starboard' ],
  togglelog: [ 'bool', false ],
  togglestar: [ 'bool', false ],
  togglewelcome: [ 'bool', false ]
};

const filters: { [ key: string ]: (value: any, client: ReknownClient, guild: Guild) => any } = {
  levelmodifier: (value: number) => {
    if (isNaN(value) || value.toString().includes('.') || value < 1 || value > 5) return [ 'The value was not a number, was a decimal, or was out of range [1-5].' ];
    return value;
  },
  logchannel: (value: string, client, guild) => {
    const channel = client.functions.parseMention(value, { cType: 'text', guild: guild, type: 'channel' });
    if (!channel) return [ 'That channel does not exist or is not a text channel.' ];
    return channel.id;
  },
  muterole: (value: string, client, guild) => {
    const role = guild.roles.cache.find(r => r.name === value) || client.functions.parseMention(value, {
      guild: guild,
      type: 'role'
    });
    if (!role) return [ 'That role does not exist.' ];
    if (guild.me!.roles.highest.comparePositionTo(role) <= 0) return [ 'The role must be below my highest role.' ];
    return role.id;
  },
  prefix: (value: string) => {
    if (value.length > 15) return [ 'The value was too long to be a prefix [15 characters].' ];
    return value;
  },
  starchannel: (value: string, client, guild) => {
    const channel = client.functions.parseMention(value, { cType: 'text', guild: guild, type: 'channel' });
    if (!channel) return [ 'That channel does not exist or is not a text channel.' ];
    return channel.id;
  },
  togglelog: (value: string) => {
    if (![ 'true', 'false' ].includes(value.toString())) return [ 'The value needs to be either `true` or `false`.' ];
    return value === 'true';
  },
  togglestar: (value: string) => {
    if (![ 'true', 'false' ].includes(value.toString())) return [ 'The value needs to be either `true` or `false`.' ];
    return value === 'true';
  },
  togglewelcome: (value: string) => {
    if (![ 'true', 'false' ].includes(value.toString())) return [ 'The value needs to be either `true` or `false`.' ];
    return value === 'true';
  }
};

export async function run (client: ReknownClient, message: GuildMessage, args: string[]) {
  if (!args[1]) {
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
  const row = await client.functions.getRow<any>(client, table, {
    guildid: message.guild.id
  });

  if (!args[2]) {
    const value: number | string | boolean = row ? row[Object.keys(row).find(r => r !== 'guildid')!] : defaultValues[table][1];

    return message.channel.send(`Current value for \`${table}\` is \`\`${client.escInline(value.toString())}\`\`.`);
  }

  let value = args.slice(2).join(' ');
  const filter = filters[table](value, client, message.guild);
  if (filter instanceof Array) return client.functions.badArg(message, 2, filter[0]);
  value = filter;

  const newRow: { [ key: string ]: any } = { guildid: message.guild.id };
  newRow[defaultValues[table][0]] = value;
  client.functions.updateRow(client, table, newRow, {
    guildid: message.guild.id
  });

  message.channel.send(`Successfully updated \`${table}\` to \`\`${client.escInline(value.toString())}\`\`.`);
}

export const help: HelpObj = {
  aliases: [ 'configuration' ],
  category: 'Miscellaneous',
  desc: 'Shows or changes configuration values for the server.',
  togglable: true,
  usage: 'config [Configuration] [Value]'
};

export const memberPerms: PermissionString[] = [
  'ADMINISTRATOR'
];

export const permissions: PermissionString[] = [
  'EMBED_LINKS'
];
