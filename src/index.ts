/* eslint-disable @typescript-eslint/no-var-requires, global-require */

import ReknownClient from './structures/client';
import { readdirSync } from 'fs';

require('dotenv').config();

const client = new ReknownClient({
  disableEveryone: true,
  partials: [ 'GUILD_MEMBER', 'MESSAGE', 'USER' ]
});

const eventList = readdirSync('./dist/events');
eventList.forEach(f => client.events.set(f.slice(0, -3), require(`./events/${f}`)));
client.events.forEach((obj, name) => client.on(name, (...args: any) => obj.run(client, ...args)));

process.on('unhandledRejection', console.log);

client.login(process.env.BOT_TOKEN);
