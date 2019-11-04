import ms from 'ms';
import { tables } from '../../Constants';
import { HelpObj, ReknownClient } from 'ReknownBot';
import { Message, MessageEmbed, TextChannel } from 'discord.js';

export async function run (client: ReknownClient, message: Message, args: string[]) {
  if (message.channel instanceof TextChannel && !message.channel.permissionsFor(client.user!)!.has('EMBED_LINKS')) return client.functions.noClientPerms(message, [ 'Embed Links' ], message.channel);

  let registered = await client.functions.getRow(client, tables.ECONOMY, {
    userid: message.author.id
  });
  if (!registered) registered = await client.functions.register(client, message.author.id);

  const cooldown = await client.functions.getRow(client, tables.WORKCOOLDOWN, {
    userid: message.author.id
  });
  if (cooldown && cooldown.endsat >= Date.now()) return message.reply(`This command is still on cooldown! Please wait ${client.functions.getTime(cooldown.endsat - Date.now())}.`);
  client.functions.updateRow(client, tables.WORKCOOLDOWN, {
    endsat: (Date.now() + ms('6h')).toString(),
    userid: message.author.id
  }, {
    userid: message.author.id
  });

  const amt = Math.floor(Math.random() * 101) + 100;
  client.functions.updateRow(client, tables.ECONOMY, {
    balance: registered.balance + amt,
    userid: message.author.id
  }, {
    userid: message.author.id
  });

  const embed = new MessageEmbed()
    .setTitle('You finished working!')
    .setColor(client.config.embedColor)
    .setDescription(`You earned **$${amt}**.`)
    .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL())
    .setTimestamp();

  message.channel.send(embed);
}

export const help: HelpObj = {
  aliases: [],
  category: 'Economy',
  desc: 'Works to get money.',
  dm: true,
  usage: 'work'
};
