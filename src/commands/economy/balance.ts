import { Message } from 'discord.js';
import { ReknownClient } from 'ReknownBot';

export async function run (client: ReknownClient, message: Message, args: string[]) {
  const user = args[1] ? await client.functions.parseMention(args[1], {
    client: client,
    type: 'user'
  }) : message.author;
  if (!user) return client.functions.badArg(message, 1, 'That user was not found.');

  const row = await client.functions.getRow(client, 'economy', {
    userid: user.id
  });
  if (!row || row.balance === 0) return message.reply('That user does not have a registered account or has no money.');

  message.channel.send(`${user.tag} has **$${row.balance}**.`);
}

export const help = {
  aliases: [ 'bal', 'money' ],
  category: 'Economy',
  desc: 'Displays a user\'s balance.',
  dm: true,
  usage: 'balance [User]'
};
