/**
 * @param {import('../../structures/client.js')} Client
 * @param {import('discord.js').Message} message
 * @param {String[]} args
*/
module.exports = async (Client, message, args) => {
  if (!await Client.checkPerms('ccreate', 'mod', message.member)) return Client.functions.get('noCustomPerm')(message, 'mod.ccreate');
  if (!message.guild.me.hasPermission('MANAGE_CHANNELS')) return Client.functions.get('noClientPerms')(message, ['Manage Channels']);

  let type = '';
  const regex = /--type \w+/;
  if (regex.test(args.join(' '))) {
    type = args.join(' ').match(/--type \w+/)[0].split(' ')[1].toLowerCase();
    args.splice(args.indexOf('--type'), 2);
  } else type = 'text';
  const types = ['text', 'voice', 'category'];
  if (!types.includes(type)) return message.reply('That type is invalid! It can be `text`, `voice`, or `category`.');

  const name = args.slice(1).join(' ');
  if (!name) return message.reply('You have to include a channel name!');
  if (type === 'text' && name.includes(' ')) return message.reply('The name cannot include a space if the channel is a text channel!');
  if (name.length > 100) return message.reply('The name cannot exceed 100 characters!');

  message.guild.channels.create(name, {
    type: type,
    reason: '?createchannel Command'
  });
  return message.channel.send(`Successfully created a ${type === 'category' ? type : `${type} channel`} with the name of \`${Client.escMD(name)}\`.`);
};

module.exports.help = {
  name: 'createchannel',
  desc: 'Creates a channel with data of your choice.',
  category: 'util',
  usage: '?createchannel <Name> [--option <Value>]',
  options: {
    type: 'Sets the type of the channel. Defaults to `text`. It can be `text`, `voice`, or `category`.'
  },
  aliases: ['cchannel', 'createchan']
};
