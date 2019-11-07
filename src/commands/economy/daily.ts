import { Message } from 'discord.js';
import ReknownClient from '../../structures/client';
import ms from 'ms';
import { tables } from '../../Constants';
import { CooldownRow, EconomyRow, HelpObj } from 'ReknownBot';

export async function run (client: ReknownClient, message: Message, args: string[]) {
  let registered = await client.functions.getRow<EconomyRow>(client, tables.ECONOMY, {
    userid: message.author.id
  });
  if (!registered) registered = await client.functions.register(client, message.author.id);

  const cooldown = await client.functions.getRow<CooldownRow>(client, tables.DAILYCOOLDOWN, {
    userid: message.author.id
  });
  if (cooldown && cooldown.endsat >= Date.now()) return message.reply(`This command is still on cooldown! Please wait ${client.functions.getTime(cooldown.endsat - Date.now())}.`);
  client.functions.updateRow(client, tables.DAILYCOOLDOWN, {
    endsat: Date.now() + ms('16h'),
    userid: message.author.id
  }, {
    userid: message.author.id
  });

  const amt = Math.floor(Math.random() * 101) + 100;
  client.functions.updateRow(client, tables.ECONOMY, {
    balance: registered.balance + amt,
    userid: message.author.id
  }, {
    userid: message.author.id
  });

  message.channel.send(`You earned **$${amt}** from daily rewards.`);
}

export const help: HelpObj = {
  aliases: [],
  category: 'Economy',
  desc: 'Gets your daily money.',
  dm: true,
  usage: 'daily'
};
