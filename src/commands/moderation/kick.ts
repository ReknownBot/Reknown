import ReknownClient from '../../structures/client';
import { DMChannel, GuildMember, Message, TextChannel } from 'discord.js';

export async function run (client: ReknownClient, message: Message & { channel: TextChannel }, args: string[]) {
  if (!message.channel.permissionsFor(client.user!)!.has('KICK_MEMBERS')) return client.functions.noClientPerms(message, [ 'Kick Members' ], message.channel);
  if (!message.member!.hasPermission('KICK_MEMBERS')) return client.functions.noPerms(message, [ 'Kick Members' ]);

  if (!args[1]) return client.functions.noArg(message, 1, 'a user to kick.');
  const member = await client.functions.parseMention(args[1], { guild: message.guild!, type: 'member' }).catch(() => false);
  const reason = args.slice(2).join(' ');
  if (!(member instanceof GuildMember)) return client.functions.badArg(message, 1, `I did not find a member by that query (${client.escMD(args[0])}).`);
  if (member.roles.highest.position >= message.member!.roles.highest.position && message.author.id !== message.guild!.ownerID) return client.functions.badArg(message, 1, 'Your role position is not high enough to kick that member.');
  if (!member.kickable) return client.functions.badArg(message, 1, 'I do not have enough powers to kick that member. Please check my permissions and my role position. Note that I cannot kick owners.');
  member.kick(reason);
  message.channel.send(`Successfully kicked member ${client.escMD(member.user.tag)} (ID: ${member.id})${reason ? ` for reason \`\`${client.escInline(reason)}\`\`` : ''}.`);
}

export const help = {
  aliases: [],
  category: 'Moderation',
  desc: 'Kicks a user.',
  usage: 'kick <User> [Reason]'
};
