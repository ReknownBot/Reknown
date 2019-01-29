module.exports = async (Client, message, args) => {
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
  try {
    const info = await Client.osu.getUser({
      u: user,
      m: modeChoices[mode]
    });

    const embed = new Client.Discord.MessageEmbed()
      .setTitle(`${info.name}'s osu!${mode !== 'standard' ? mode : ''} Stats`)
      .setURL(`https://osu.ppy.sh/users/${info.id}`)
      .setColor(0x00FFFF)
      .setFooter(`User ID: ${info.id} | Requested by ${message.author.tag}`, message.author.displayAvatarURL())
      .addField('PP (Performance Points)', info.pp.raw, true)
      .addField('Global Rank', info.pp.rank, true)
      .addField('Country Rank', info.pp.countryRank, true)
      .addField('Country', info.country, true)
      .addField('Level', Math.round(info.level * 10) / 10, true)
      .addField('Accuracy', Math.round(info.accuracy * 100) / 100, true)
      .addField('Total Score', info.scores.total, true)
      .addField('Ranked Score', info.scores.ranked, true)
      .addField('SS Count', info.counts['SS'], true)
      .addField('S Count', info.counts['S'], true)
      .addField('A Count', info.counts['A'], true)
      .addField('Play Count', info.counts['plays'], true);

    return message.channel.send(embed);
  } catch (e) {
    if (e != 'Error: User not found') {
      process.emit('unhandledRejection', e);
      message.channel.send(`Something went wrong while executing this command.\n\n\`\`\`xl\n${e}\n\`\`\``);
    } else message.reply('That is not a valid osu! user!');
  }
};

module.exports.help = {
  name: 'osu',
  desc: 'Displays a user\'s stats on a game called osu!.',
  category: 'fun',
  usage: '?osu <Mode> <Player Name or ID>',
  aliases: []
};
