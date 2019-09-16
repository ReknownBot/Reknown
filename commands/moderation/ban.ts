import { GuildMember, Message, TextChannel, User } from 'discord.js';
import ReknownClient from '../../structures/client';

module.exports.run = async (client: ReknownClient, message: Message, args: string[]): Promise<void> => {
  // eslint-disable-next-line no-extra-parens
  if (!(message.channel as TextChannel).permissionsFor(client.user).has('BAN_MEMBERS')) return client.functions.noClientPerms(message, [ 'Ban Members' ], message.channel);

  if (!args[1]) return client.functions.noArg(message, 1, 'a user to ban.');
  // eslint-disable-next-line no-extra-parens
  const member: GuildMember | boolean = await (client.functions.parseMention(args[1], message.guild, { type: 'member' }) as unknown as Promise<GuildMember>).catch(() => false);
  const reason = args[2] ? args.slice(2).join(' ') : null;
  if (member instanceof GuildMember) {
    if (!member.bannable) return client.functions.badArg(message, 1, 'I do not have enough powers to ban that member. Please check my permissions and my role position. Note that I cannot ban owners.');
    member.ban({ reason: reason });
    return void message.channel.send(`Successfully banned member ${client.escMD(member.user.tag)} (ID: ${member.id})${reason ? ` for reason \`${client.escMD(reason)}\`` : ''}.`);
  }

  // eslint-disable-next-line no-extra-parens
  const user: User | boolean = await (client.functions.parseMention(args[1], message.guild, { type: 'user', client: client }) as unknown as Promise<User>).catch(() => false);
  if (!(user instanceof User)) return client.functions.badArg(message, 1, `I did not find a user by that query (${client.escMD(args[0])}).`);
  message.guild.members.ban(user, { reason: reason });
  return void message.channel.send(`Successfully banned user ${client.escMD(user.tag)} (ID: ${user.id})${reason ? ` for reason \`${client.escMD(reason)}\`` : ''}.`);
};

module.exports.help = {
  aliases: [ 'banish' ],
  category: 'Moderation',
  desc: 'Bans a user.',
  usage: 'ban <User> [Reason]'
};
