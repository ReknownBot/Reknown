import * as config from '../config.json';
import Node from 'lavalink';
import { Pool } from 'pg';
import { readdirSync } from 'fs';
import { Client, Collection, Util } from 'discord.js';
import { CommandCategory, ConfigObject, MusicObject, ReknownCommand, ReknownEvent, ReknownFunctions } from 'ReknownBot';

const pool = new Pool();

const fnList = readdirSync('./dist/functions');
const functions: ReknownFunctions | { [ fn: string ]: { run: Function }} = {};
fnList.forEach(fn => {
  // eslint-disable-next-line global-require
  functions[fn] = require(`../functions/${fn}`).run;
});

export default class ReknownClient extends Client {
  public aliases: { [ command: string ]: string } = {};

  public categories: CommandCategory[] = [];

  public commands = new Collection<string, ReknownCommand>();

  public config: ConfigObject = config;

  public escMD = Util.escapeMarkdown;

  public escInline = (str: string) => str.replace(/`/g, '\u200B`\u200B');

  public events = new Collection<string, ReknownEvent>();

  public functions: ReknownFunctions = functions as ReknownFunctions;

  public lavalink: Node | null = null;

  public prefixes: { [ id: string ]: string } = {};

  public query = pool.query.bind(pool);

  public music: { [ id: string ]: MusicObject } = {};
}
