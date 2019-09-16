import * as config from '../config.json';
import { Client, Collection, Util } from 'discord.js';
import { Pool } from 'pg';
import { ConfigObject, ReknownEvent, ReknownCommand, CommandCategory } from 'ReknownBot';
import polyfill from 'promise-polyfill';

const pool = new Pool({
  Promise: polyfill
});

export default class ReknownClient extends Client {
  public aliases: { [ command: string ]: string } = {};

  public categories: CommandCategory[];

  public commands = new Collection<string, ReknownCommand>();

  public config: ConfigObject = config;

  public escMD = Util.escapeMarkdown;

  public events = new Collection<string, ReknownEvent>();

  public functions: { [ name: string ]: (...args) => void } = {};

  public query = pool.query.bind(pool);
}
