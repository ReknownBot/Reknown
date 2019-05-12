/**
 * @param {import('../../structures/client.js')} Client
 * @param {import('discord.js').Message} message
 * @param {String[]} args
 */
module.exports = async (Client, message, args) => {
  if (!Client.checkClientPerms(message.channel, 'EMBED_LINKS')) return Client.functions.get('noClientPerms')(message, ['Embed Links'], message.channel);

  if (!args[1]) return Client.functions.get('argMissing')(message.channel, 1, 'an osu! mode (standard, taiko, ctb, or mania)');
  const mode = args[1].toLowerCase();
  const modeChoices = {
    standard: 0,
    taiko: 1,
    ctb: 2,
    mania: 3
  };
  if (!Object.keys(modeChoices).includes(mode)) return Client.functions.get('argFix')(Client, message.channel, 1, 'Was not a valid osu! type. The following are allowed: standard, taiko, ctb, and mania.');

  if (!args[2]) return Client.functions.get('argMissing')(message.channel, 2, 'an osu! username to search for');
  const user = args.slice(2).join(' ').toLowerCase();

  let info = await Client.fetch(`https://osu.ppy.sh/api/get_user?k=${process.env.OSU_KEY}&u=${encodeURIComponent(user)}&m=${modeChoices[mode]}`).then(res => res.json());
  info = info[0];

  if (!info) return Client.functions.get('argFix')(Client, message.channel, 2, 'Did not find an osu! user with that query.');

  const embed = new Client.Discord.MessageEmbed()
    .setTitle(`${info.username}'s osu!${mode !== 'standard' ? mode : ''} Stats`)
    .setURL(`https://osu.ppy.sh/users/${info.user_id}`)
    .setColor(0x00FFFF)
    .setFooter(`User ID: ${info.user_id} | Requested by ${message.author.tag}`, message.author.displayAvatarURL())
    .addField('PP (Performance Points)', Client.formatNum(info.pp_raw), true)
    .addField('Global Rank', `#${Client.formatNum(info.pp_rank)}`, true)
    .addField('Country Rank', `#${Client.formatNum(info.pp_country_rank)}`, true)
    .addField('Country', info.country, true)
    .addField('Level', Client.formatNum(Math.round(info.level * 10) / 10), true)
    .addField('Accuracy', Client.formatNum(Math.round(info.accuracy * 100) / 100), true)
    .addField('Total Score', Client.formatNum(info.total_score), true)
    .addField('Ranked Score', Client.formatNum(info.ranked_score), true)
    .addField('SS Count', Client.formatNum(info.count_rank_ss), true)
    .addField('SSH Count', Client.formatNum(info.count_rank_ssh), true)
    .addField('S Count', Client.formatNum(info.count_rank_s), true)
    .addField('SH Count', Client.formatNum(info.count_rank_sh), true)
    .addField('A Count', Client.formatNum(info.count_rank_a), true)
    .addField('Play Count', Client.formatNum(info.playcount), true);

  return message.channel.send(embed);
};

module.exports.help = {
  name: 'osu',
  desc: 'Displays a user\'s stats on a game called osu!.',
  category: 'fun',
  usage: '?osu <Mode> <Player Name or ID>',
  aliases: []
};
