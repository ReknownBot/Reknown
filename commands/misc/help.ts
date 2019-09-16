import ReknownClient from '../../structures/client';
import { Message, TextChannel, MessageEmbed } from 'discord.js';

module.exports.run = async (client: ReknownClient, message: Message, args: string[]): Promise<void> => {
  if (!(message.channel as TextChannel).permissionsFor(client.user).has('EMBED_LINKS')) return client.functions.noClientPerms(message, [ 'Embed Links' ], message.channel);

  const prefix: string = await client.functions.getPrefix(client, message.guild.id) as unknown as string;
  if (!args[1]) {
    let commands = client.commands.keyArray();

    if (message.author.id !== client.config.ownerID) commands = commands.filter(c => !client.commands.get(c).help.private);

    const embed = new MessageEmbed()
      .setColor(client.config.embedColor)
      .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL())
      .setTimestamp()
      .setTitle('Commands List');

    commands.forEach(cmd => {
      const info = client.commands.get(cmd).help;
      const field = embed.fields.find(f => f.name === info.category);
      if (field) embed.fields[embed.fields.indexOf(field)].value += `\n- \`${prefix + cmd}\``;
      else embed.addField(info.category, `- \`${prefix + cmd}\``, true);
    });

    return void message.channel.send(embed);
  }

  const query = args.slice(1).join(' ').toLowerCase();
  if (!client.commands.has(query) && !client.categories.some(c => c.toLowerCase() === query)) return client.functions.badArg(message, 1, 'The query provided was neither a category or a command.');

  const cmd = client.commands.get(query);
  if (cmd) {
    const embed = new MessageEmbed()
      .addField('Usage', prefix + cmd.help.usage, true)
      .addField('Category', cmd.help.category, true)
      .addField('Aliases', cmd.help.aliases.map(alias => `\`${prefix + alias}\``).join(', '), true)
      .setColor(client.config.embedColor)
      .setDescription(cmd.help.desc)
      .setFooter('[Arg] = Optional | <Arg> = Required', message.author.displayAvatarURL())
      .setTitle(`${prefix + query} Command Information`);

    return void message.channel.send(embed);
  }

  const category = client.categories.find(c => c.toLowerCase() === query);
  const cCommands = client.commands.keyArray().filter(c => client.commands.get(c).help.category.toLowerCase() === query);
  const embed = new MessageEmbed()
    .setColor(client.config.embedColor)
    .setDescription(cCommands.map(c => `- \`${prefix + c}\``).join('\n'))
    .setFooter(`${cCommands.length} Category Commands | Requested by ${message.author.tag}`, message.author.displayAvatarURL())
    .setTimestamp()
    .setTitle(`${category} Category Information`);

  return void message.channel.send(embed);
};

module.exports.help = {
  aliases: [ 'commands', 'command' ],
  category: 'Miscellaneous',
  desc: 'Displays the help menu or shows information about a command or category.',
  usage: 'help [Command or Category]'
};
