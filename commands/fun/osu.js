module.exports = async (Client, message, args) => {
  if (!Client.checkClientPerms(message.channel, 'EMBED_LINKS')) return Client.functions.get('noClientPerms')(message, ['Embed Links'], message.channel);

  if (!args[1]) return message.reply('Please specify one of the modes; standard, taiko, ctb, or mania.');
  const mode = args[1].toLowerCase();
  const modeChoices = {
    standard: 0,
    taiko: 1,
    ctb: 2,
    mania: 3
  };
  const user = args.slice(2).join(' ').toLowerCase();
  if (!Object.keys(modeChoices).includes(mode)) return message.reply('That is not a valid mode! The modes are standard, taiko, ctb, and mania.');
  if (!user) return message.reply('Please specify a player for me to get stats on.');
  let info = await Client.fetch(`https://osu.ppy.sh/api/get_user?k=${process.env.OSU_KEY}&u=${encodeURIComponent(user)}&m=${modeChoices[mode]}`).then(res => res.json());
  info = info[0];

  if (!info) return message.reply('I did not find a user with that query.');

  const embed = new Client.Discord.MessageEmbed()
    .setTitle(`${info.username}'s osu!${mode !== 'standard' ? mode : ''} Stats`)
    .setURL(`https://osu.ppy.sh/users/${info.user_id}`)
    .setColor(0x00FFFF)
    .setFooter(`User ID: ${info.user_id} | Requested by ${message.author.tag}`, message.author.displayAvatarURL())
    .addField('PP (Performance Points)', info.pp_raw, true)
    .addField('Global Rank', info.pp_rank, true)
    .addField('Country Rank', info.pp_country_rank, true)
    .addField('Country', info.country, true)
    .addField('Level', Math.round(info.level * 10) / 10, true)
    .addField('Accuracy', Math.round(info.accuracy * 100) / 100, true)
    .addField('Total Score', info.total_score, true)
    .addField('Ranked Score', info.ranked_score, true)
    .addField('SS Count', info.count_rank_ss, true)
    .addField('SSH Count', info.count_rank_ssh, true)
    .addField('S Count', info.count_rank_s, true)
    .addField('SH Count', info.count_rank_sh, true)
    .addField('A Count', info.count_rank_a, true)
    .addField('Play Count', info.playcount, true);

  return message.channel.send(embed);
};

module.exports.help = {
  name: 'osu',
  desc: 'Displays a user\'s stats on a game called osu!.',
  category: 'fun',
  usage: '?osu <Mode> <Player Name or ID>',
  aliases: []
};
