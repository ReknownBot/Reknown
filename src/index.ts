/* eslint-disable @typescript-eslint/no-var-requires, global-require */

import ReknownClient from './structures/client';
import { readdirSync } from 'fs';

require('dotenv').config();

const client = new ReknownClient({
  disableEveryone: true,
  partials: [ 'GUILD_MEMBER', 'MESSAGE', 'USER' ]
});
const categories = readdirSync('./dist/commands');
categories.forEach(name => readdirSync(`./dist/commands/${name}`).filter(f => f.endsWith('.js')).forEach(f => client.commands.set(f.slice(0, -3), require(`./commands/${name}/${f}`))));
const eventList = readdirSync('./dist/events').filter(f => f.endsWith('.js'));
eventList.forEach(f => client.events.set(f.slice(0, -3), require(`./events/${f}`)));
client.commands.forEach((obj, name) => {
  obj.help.aliases.forEach(alias => {
    client.aliases[alias] = name;
  });
  client.aliases[name] = name;
});
client.categories = [ ...new Set(client.commands.map(c => c.help.category)) ];

client.events.forEach((obj, name) => client.on(name, (...args: any) => obj.run(client, ...args)));

process.on('unhandledRejection', console.log);

client.login(process.env.BOT_TOKEN);
