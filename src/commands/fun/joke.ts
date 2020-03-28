import type { HelpObj } from '../../structures/commandhandler';
import type ReknownClient from '../../structures/client';
import fetch from 'node-fetch';
import type { Message, PermissionString } from 'discord.js';

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

export const help: HelpObj = {
  aliases: [],
  category: 'Fun',
  desc: 'Tells you a joke.',
  dm: true,
  togglable: true,
  usage: 'joke'
};

export const memberPerms: PermissionString[] = [];

export const permissions: PermissionString[] = [];
