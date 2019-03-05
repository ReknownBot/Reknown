module.exports = async (Client, message, args) => {
  if (!args[1]) return message.reply('You have to provide what I should search!');
  const options = ['player', 'guild', 'guildmember'];
  const option = args[1].toLowerCase();
  if (!options.includes(option)) return message.reply(`That option is not valid! The options are \`${options.list()}\`.`);
  if (!args[2]) return message.reply('You have to provide what I should search by!');

  if (option === 'player') {
    const json = await Client.fetch(`https://api.hypixel.net/player?key=${process.env.HYPIXEL_KEY}&name=${encodeURIComponent(args[2])}`).then(res => res.json());
    if (!json.success) return message.reply('Either the Hypixel API is down, or the API key is incorrect. Please report this in my support server.');
    if (!json.player) return message.reply('That player name is not valid!');
    const player = json.player;

    const embed = new Client.Discord.MessageEmbed()
      .setTitle(`${Client.escMD(player.displayname)}'s Hypixel Stats`)
      .setURL(`https://hypixel.net/player/${player.displayname}/`)
      .addField('Achievements Completed', Object.values(player.achievements).reduce((a, b) => a + b, 0), true)
      .addField('Network Exp', player.networkExp, true)
      .addField('Karma', player.karma, true)
      .addField('Votes', player.voting ? player.voting.total : '0', true)
      .setColor(0x00FFFF);

    return message.channel.send(embed);
  } else if (option === 'guild') {
    const info = await Client.fetch(`https://api.hypixel.net/guild?key=${process.env.HYPIXEL_KEY}&name=${encodeURIComponent(args.slice(2).join(' '))}`);
    const json = await info.json();
    if (!json.success) return message.reply('Either the Hypixel API is down, or the API key is incorrect. Please report this in my support server.');
    if (!json.guild) return message.reply('I did not find a guild by that name!');
    const guild = json.guild;

    const embed = new Client.Discord.MessageEmbed()
      .setTitle(`${Client.escMD(guild.name)} Guild Stats`)
      .setURL(`https://hypixel.net/guilds/${encodeURIComponent(guild.name)}/`)
      .addField('Member Count', guild.members.length)
      .addField('Guild Tag', guild.tag ? guild.tag : 'None')
      .addField('XP', guild.exp)
      .setColor(0x00FFFF);

    return message.channel.send(embed);
  } else if (option === 'guildmember') {
    const playerInfo = await Client.fetch(`https://api.hypixel.net/player?key=${process.env.HYPIXEL_KEY}&name=${encodeURIComponent(args[2])}`);
    const playerJSON = await playerInfo.json();
    if (!playerJSON.success) return message.reply('Either the Hypixel API is down, or the API key is incorrect. Please report this in my support server.');
    if (!playerJSON.player) return message.reply('That player name is not valid!');
    const uuid = playerJSON.player.uuid;

    const info = await Client.fetch(`https://api.hypixel.net/guild?key=${process.env.HYPIXEL_KEY}&player=${encodeURIComponent(uuid)}`);
    const json = await info.json();
    if (!json.guild) return message.reply('I did not find a guild by that member name!');
    const guild = json.guild;

    const embed = new Client.Discord.MessageEmbed()
      .setTitle(`${Client.escMD(guild.name)} Guild Stats`)
      .setURL(`https://hypixel.net/guilds/${encodeURIComponent(guild.name)}/`)
      .addField('Member Count', guild.members.length)
      .addField('Guild Tag', guild.tag ? guild.tag : 'None')
      .addField('XP', guild.exp)
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
