import { Message } from 'discord.js';
import ReknownClient from '../../structures/client';
import fetch from 'node-fetch';

interface JokeResult {
  id: string;
  joke?: string;
  status: number;
}

export async function run (client: ReknownClient, message: Message, args: string[]) {
  const json: JokeResult = await fetch('https://icanhazdadjoke.com/', { headers: {
    Accept: 'application/json'
  } }).then(res => res.json());
  if (!json.joke) return message.reply('Seems like the joke API is unavailable, please try again later.');

  message.channel.send(json.joke);
}

export const help = {
  aliases: [],
  category: 'Fun',
  desc: 'Tells you a joke.',
  dm: true,
  usage: 'joke'
};
