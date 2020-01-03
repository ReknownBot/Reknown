import { HelpObj } from 'ReknownBot';
import ReknownClient from '../../structures/client';
import { Message, MessageEmbed, PermissionString } from 'discord.js';

export async function run (client: ReknownClient, message: Message, args: string[]) {
  const prefix = message.guild ? await client.functions.getPrefix(client, message.guild.id) : client.config.prefix;
  if (!args[1]) {
    let commands = client.commands.keyArray();

    if (message.author.id !== client.config.ownerID) commands = commands.filter(c => !client.commands.get(c)!.help.private);

    const embed = new MessageEmbed()
      .setColor(client.config.embedColor)
      .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL())
      .setTimestamp()
      .setAuthor('Commands List', undefined, 'https://reknown.xyz/commands');

    commands.forEach(cmd => {
      const info = client.commands.get(cmd)!.help;
      const field = embed.fields.find(f => f.name === info.category);
      if (field) embed.fields[embed.fields.indexOf(field)].value += `\n- \`${prefix + cmd}\``;
      else embed.addField(info.category, `- \`${prefix + cmd}\``, true);
    });

    return message.channel.send(embed);
  }

  const query = args.slice(1).join(' ').toLowerCase();
  if (!client.commands.aliases[query] && !client.commands.categories.some(c => c.toLowerCase() === query)) return client.functions.badArg(message, 1, 'The query provided was neither a category or a command.');

  const cmd = client.commands.get(client.commands.aliases[query]);
  if (cmd) {
    const embed = new MessageEmbed()
      .addField('Usage', prefix + cmd.help.usage, true)
      .addField('Category', cmd.help.category, true)
      .addField('Usable in DMs', cmd.help.dm ? 'Yes' : 'No', true)
      .setColor(client.config.embedColor)
      .setDescription(cmd.help.desc)
      .setFooter('[Arg] = Optional | <Arg> = Required', message.author.displayAvatarURL())
      .setTitle(`${prefix + query} Command Information`);
    if (cmd.help.aliases.length !== 0) embed.addField('Aliases', cmd.help.aliases.map(alias => `\`${prefix + alias}\``).join(', '), true);

    return message.channel.send(embed);
  }

  const category = client.commands.categories.find(c => c.toLowerCase() === query);
  const cCommands = client.commands.keyArray().filter(c => client.commands.get(c)!.help.category.toLowerCase() === query);
  const embed = new MessageEmbed()
    .setColor(client.config.embedColor)
    .setDescription(cCommands.map(c => `- \`${prefix + c}\``).join('\n'))
    .setFooter(`${cCommands.length} Category Commands | Requested by ${message.author.tag}`, message.author.displayAvatarURL())
    .setTimestamp()
    .setTitle(`${category} Category Information`);

  message.channel.send(embed);
}

export const help: HelpObj = {
  aliases: [ 'command', 'commands' ],
  category: 'Miscellaneous',
  desc: 'Displays the help menu or shows information about a command or category.',
  dm: true,
  togglable: false,
  usage: 'help [Command or Category]'
};

export const memberPerms: PermissionString[] = [];

export const permissions: PermissionString[] = [
  'EMBED_LINKS'
];
