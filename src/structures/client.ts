import * as config from '../config.json';
import CommandHandler from './commandhandler';
import DBL from 'dblapi.js';
import { Functions } from './functions';
import type Node from 'lavalink';
import Postgres from 'postgres';
import { config as configure } from 'dotenv';
import { Client, Collection, Util } from 'discord.js';
import type { GuildEmoji, Snowflake } from 'discord.js';
import type { Player, Track } from 'lavalink';

configure();

interface ConfigObject {
  contributors: Snowflake[];
  embedColor: string;
  emojis: { [ emoji: string ]: Snowflake };
  muteColor: string;
  officialClient: Snowflake;
  ownerID: Snowflake;
  prefix: string;
  suggestions: Snowflake;
  version: string;
}

export type EmoteName = 'online'
  | 'idle'
  | 'dnd'
  | 'offline';

export interface MusicObject {
  equalizer: number;
  looping: boolean;
  player?: Player;
  queue: Track[];
  volume: number;
}

export interface ReknownEvent {
  run: (...args: any) => void;
}

const pg = Postgres({
  db: process.env.PGDATABASE,
  host: process.env.PGHOST,
  port: parseInt(process.env.PGPORT!),
  username: process.env.PGUSER,
  password: process.env.PGPASSWORD
});

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

  public mutes = new Collection<Snowflake, NodeJS.Timeout>();

  public prefixes: { [ id: string ]: string } = {};

  public music: { [ id: string ]: MusicObject | undefined } = {};

  public sql = pg;
}
