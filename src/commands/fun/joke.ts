import type { HelpObj } from '../../structures/commandhandler';
import type ReknownClient from '../../structures/client';
import fetch from 'node-fetch';
import type { Message, PermissionResolvable } from 'discord.js';

interface JokeResult {
  id: string;
  joke?: string;
  status: number;
}

export async function run (client: ReknownClient, message: Message, args: string[]) {
  const json = await fetch('https://icanhazdadjoke.com/', { headers: {
    Accept: 'application/json'
  } }).then(res => res.json()) as JokeResult;
  if (!json.joke) return message.reply('Seems like the joke API is unavailable, please try again later.');

  message.reply(json.joke);
}

export const help: HelpObj = {
  aliases: [],
  category: 'Fun',
  desc: 'Tells you a joke.',
  dm: true,
  togglable: true,
  usage: 'joke'
};

export const memberPerms: PermissionResolvable[] = [];

export const permissions: PermissionResolvable[] = [];
