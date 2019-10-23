import { Message } from 'discord.js';
import ReknownClient from '../../structures/client';

module.exports.run = (client: ReknownClient, message: Message) => {
  message.channel.send(`**Add Reknown to your Server**: <https://discordapp.com/oauth2/authorize?client_id=${client.user!.id}&scope=bot>`);
};

module.exports.help = {
  aliases: [ 'botinvite' ],
  category: 'Miscellaneous',
  desc: 'Provides you with the bot invite.',
  usage: 'invite'
};
