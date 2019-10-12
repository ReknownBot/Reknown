import * as config from '../config.json';
import { Client, Collection, Util } from 'discord.js';
import { Pool } from 'pg';
import { ConfigObject, ReknownEvent, ReknownCommand, CommandCategory, ReknownFunctions, MusicObject } from 'ReknownBot';
import { readdirSync } from 'fs';
import Node from 'lavalink';

const pool = new Pool();

const fnList = readdirSync('./functions').map(f => f.slice(0, -3));
const functions: ReknownFunctions | { [ fn: string ]: { run: Function }} = {};
fnList.forEach(fn => {
  // eslint-disable-next-line global-require
  functions[fn] = require(`../functions/${fn}.js`);
});

export default class ReknownClient extends Client {
  public aliases: { [ command: string ]: string } = {};

  public categories: CommandCategory[] = [];

  public commands = new Collection<string, ReknownCommand>();

  public config: ConfigObject = config;

  public escMD = Util.escapeMarkdown;

  public events = new Collection<string, ReknownEvent>();

  public functions: ReknownFunctions = functions as ReknownFunctions;

  public lavalink: Node | null = null;

  public query = pool.query.bind(pool);

  public music: { [ id: string ]: MusicObject } = {};
}
