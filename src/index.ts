/* eslint-disable @typescript-eslint/no-var-requires, global-require */

import ReknownClient from './structures/Client';
import { readdirSync } from 'fs';
import { version } from './config.json';
import { ClientEvents, Constants, Intents } from 'discord.js';

const client = new ReknownClient({
  allowedMentions: {
    parse: [ 'roles', 'users' ]
  },
  intents: [ Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_BANS, Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS, Intents.FLAGS.GUILD_WEBHOOKS,
    Intents.FLAGS.GUILD_VOICE_STATES, Intents.FLAGS.GUILD_PRESENCES, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS ],
  partials: [ Constants.PartialTypes.GUILD_MEMBER, Constants.PartialTypes.MESSAGE, Constants.PartialTypes.REACTION, Constants.PartialTypes.USER ],
  presence: {
    activities: [{
      name: `on ${version}`,
      type: 'PLAYING'
    }]
  }
});

const eventList = readdirSync('./dist/events');
eventList.forEach(f => client.events.set(f.slice(0, -3), require(`./events/${f}`)));
client.events.forEach((obj, name) => client.on(name as keyof ClientEvents, (...args: any) => obj.run(client, ...args)));

process.on('unhandledRejection', console.log);

client.login(process.env.BOT_TOKEN);
