import { GuildMember, Message, User, DMChannel } from 'discord.js';
import ReknownClient from '../../structures/client';

module.exports.run = async (client: ReknownClient, message: Message, args: string[]) => {
  if (message.channel instanceof DMChannel) return message.reply(':x: This command is only available in servers.');
  if (!message.channel.permissionsFor(client.user!)!.has('BAN_MEMBERS')) return client.functions.noClientPerms(message, [ 'Ban Members' ], message.channel);
  if (!message.member!.hasPermission('BAN_MEMBERS')) return client.functions.noPerms(message, [ 'Ban Members' ]);

  if (!args[1]) return client.functions.noArg(message, 1, 'a user to ban.');
  const member = await client.functions.parseMention(args[1], { guild: message.guild!, type: 'member' }).catch(() => false);
  const reason = args[2] ? args.slice(2).join(' ') : undefined;
  if (member instanceof GuildMember) {
    if (member.roles.highest.position >= message.member!.roles.highest.position && message.author.id !== message.guild!.ownerID) return client.functions.badArg(message, 1, 'Your role position is not high enough to ban that member.');
    if (!member.bannable) return client.functions.badArg(message, 1, 'I do not have enough powers to ban that member. Please check my permissions and my role position. Note that I cannot ban owners.');
    member.ban({ reason: reason });
    message.channel.send(`Successfully banned member ${client.escMD(member.user.tag)} (ID: ${member.id})${reason ? ` for reason \`${client.escMD(reason)}\`` : ''}.`);
    return;
  }

  const user = await client.functions.parseMention(args[1], { type: 'user', client: client }).catch(() => false);
  if (!(user instanceof User)) return client.functions.badArg(message, 1, `I did not find a user by that query (${client.escMD(args[0])}).`);
  message.guild!.members.ban(user, { reason: reason });
  message.channel.send(`Successfully banned user ${client.escMD(user.tag)} (ID: ${user.id})${reason ? ` for reason \`${client.escMD(reason)}\`` : ''}.`);
};

module.exports.help = {
  aliases: [ 'banish' ],
  category: 'Moderation',
  desc: 'Bans a user.',
  usage: 'ban <User> [Reason]'
};
