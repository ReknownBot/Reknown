/* eslint-disable @typescript-eslint/no-var-requires, global-require */

import ReknownClient from './structures/client';
import { readdirSync } from 'fs';
import { version } from './config.json';

require('dotenv').config();

const client = new ReknownClient({
  disableMentions: 'everyone',
  partials: [ 'GUILD_MEMBER', 'MESSAGE', 'REACTION', 'USER' ],
  presence: {
    activity: {
      name: `on ${version}`,
      type: 'PLAYING'
    }
  }
});

const eventList = readdirSync('./dist/events');
eventList.forEach(f => client.events.set(f.slice(0, -3), require(`./events/${f}`)));
client.events.forEach((obj, name) => client.on(name, (...args: any) => obj.run(client, ...args)));

process.on('unhandledRejection', console.log);

client.login(process.env.BOT_TOKEN);
