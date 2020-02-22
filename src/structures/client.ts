import * as config from '../config.json';
import CommandHandler from './commandhandler';
import DBL from 'dblapi.js';
import { Functions } from './functions';
import type Node from 'lavalink';
import { Pool } from 'pg';
import { Client, Collection, Util } from 'discord.js';
import type { ConfigObject, EmoteName, MusicObject, ReknownEvent } from 'ReknownBot';
import type { GuildEmoji, Snowflake } from 'discord.js';

const pool = new Pool();

export default class ReknownClient extends Client {
  public commands = new CommandHandler();

  public config: ConfigObject = config;

  public dbl: DBL | null = null;

  public emotes = new Collection<EmoteName, GuildEmoji>();

  public escMD = Util.escapeMarkdown;

  public escInline = (str: string) => str.replace(/`/g, '\u200B`\u200B');

  public events = new Collection<string, ReknownEvent>();

  public functions = new Functions();

  public lavalink: Node | null = null;

  public mutes = new Collection<Snowflake, number>();

  public prefixes: { [ id: string ]: string } = {};

  public query = pool.query.bind(pool);

  public music: { [ id: string ]: MusicObject } = {};
}
