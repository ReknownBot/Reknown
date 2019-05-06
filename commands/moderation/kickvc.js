/**
 * @param {import('../../structures/client.js')} Client
 * @param {import('discord.js').Message} message
 * @param {String[]} args
*/
module.exports = async (Client, message, args) => {
  if (!await Client.checkPerms('kickvc', 'mod', message.member)) return Client.functions.get('noCustomPerm')(message, 'mod.kickvc');

  if (!args[1]) return Client.functions.get('argMissing')(message.channel, 1, 'a member to kick from a voice channel');
  /** @type {import('discord.js').GuildMember} */
  const member = await Client.getObj(args[1], { guild: message.guild, type: 'member' });
  if (!member) return Client.functions.get('argFix')(Client, message.channel, 1, 'The member provided was invalid.');

  const channel = member.voice.channel;
  if (!channel) return Client.functions.get('argFix')(Client, message.channel, 1, 'The member provided was not in a voice channel.');
  if (!Client.checkClientPerms(channel, 'CONNECT', 'MOVE_MEMBERS')) return Client.functions.get('noClientPerms')(message, ['Connect', 'Move Members'], channel);

  const reason = args.slice(2).join(' ');
  member.voice.setChannel(null, reason);

  return message.channel.send(`Successfully kicked ${member.user.tag} from a voice channel${reason ? ` for ${reason}` : '.'}`);
};

module.exports.help = {
  name: 'kickvc',
  desc: 'Kicks a member from a voice channel.',
  category: 'moderation',
  usage: '?kickvc <Member> [Reason]',
  aliases: []
};
