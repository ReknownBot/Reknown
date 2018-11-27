module.exports = async (Client, message, args) => {
  if (!args[1]) return message.reply('You have to provide what I should search!');
  const options = ['player', 'guild', 'guildmember'];
  const option = args[1].toLowerCase();
  if (!options.includes(option)) return message.reply(`That option is not valid! The options are \`${options.list()}\`.`);
  if (!args[2]) return message.reply('You have to provide what I should search by!');

  const hypixel = Client.hypixel;

  if (option === 'player') {
    const info = await hypixel.getPlayer('name', args[2]).catch(() => 'failed');
    if (info === 'failed') return message.reply('That player name is not valid!');
    const player = info.player;

    const embed = new Client.Discord.MessageEmbed()
      .setTitle(`${Client.escapeMarkdown(player.displayname)}'s Hypixel Stats`)
      .setURL(`https://hypixel.net/player/${player.displayname}/`)
      .addField('Achievements Completed', Object.values(player.achievements).reduce((a, b) => a + b, 0), true)
      .addField('Network Exp', player.networkExp, true)
      .addField('Karma', player.karma, true)
      .addField('Votes', player.voting ? player.voting.total : '0', true)
      .setColor(0x00FFFF);

    return message.channel.send(embed);
  } else if (option === 'guild') {
    const info = await hypixel.findGuild('name', args.slice(2).join(' '));
    if (!info.guild) return message.reply('I did not find a guild by that name!');
    const guildid = info.guild;

    const { guild } = await hypixel.getGuild(guildid);

    const embed = new Client.Discord.MessageEmbed()
      .setTitle(`${Client.escapeMarkdown(guild.name)} Guild Stats`)
      .setURL(`https://hypixel.net/guilds/${guild.name.replace(' ', '%20')}/`)
      .addField('Member Count', guild.members.length)
      .addField('Guild Tag', guild.tag ? guild.tag : 'None')
      .addField('XP', guild.exp)
      .setColor(0x00FFFF);

    return message.channel.send(embed);
  } else if (option === 'guildmember') {
    const info = await hypixel.findGuild('memberName', args[2]).catch(() => 'failed');
    if (info === 'failed' || !info.guild) return message.reply('I did not find a guild by that member\'s name!');

    const { guild: guildInfo } = await hypixel.getGuild(info.guild);

    const embed = new Client.Discord.MessageEmbed()
      .setTitle(`${Client.escapeMarkdown(guildInfo.name)} Guild Stats`)
      .setURL(`https://hypixel.net/guilds/${guildInfo.name.replace(' ', '%20')}/`)
      .addField('Member Count', guildInfo.members.length)
      .addField('Guild Tag', guildInfo.tag ? guildInfo.tag : 'None')
      .addField('XP', guildInfo.exp)
      .setColor(0x00FFFF);

    return message.channel.send(embed);
  }
};

module.exports.help = {
  name: 'hypixel',
  desc: 'Displays info about the Minecraft server, Hypixel!',
  category: 'fun',
  usage: '?hypixel player <Player Name>\n?hypixel guild <Guild Name>\n?hypixel guildmember <Guild Member Name>',
  aliases: []
};
