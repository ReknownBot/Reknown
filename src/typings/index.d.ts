declare module 'ReknownBot' {
  import { CategoryChannel, ClientUser, Guild, GuildChannel, GuildMember, Message, MessageEmbed, Role, Snowflake, TextChannel, User, VoiceChannel } from 'discord.js';
  import { Player, Track } from 'lavalink';
  type ReknownClient = import('../structures/client').default;

  export class ReknownFunctions {
    public badArg(message: Message, argNum: number, desc: string): void;
    public endSession(music: MusicObject): void;
    public formatNum(num: number): string;
    public getPrefix(client: ReknownClient, id: Snowflake): Promise<string>;
    public noArg(message: Message, argNum: number, desc: string): void;
    public noClientPerms(message: Message, perms: string[], channel?: GuildChannel): void;
    public noPerms(message: Message, perms: string[], channel?: GuildChannel): void;
    public parseMention(id: Snowflake, options: ParseMentionOptions & { type: 'member' }): Promise<GuildMember | null>;
    public parseMention(id: Snowflake, options: ParseMentionOptions & { type: 'user' }): Promise<User | null>;
    public parseMention(id: Snowflake, options: ParseMentionOptions & { type: 'role' }): Promise<Role | null>;
    public parseMention(id: Snowflake, options: ParseMentionOptions & { type: 'channel'; cType?: 'text' }): TextChannel | null;
    public parseMention(id: Snowflake, options: ParseMentionOptions & { type: 'channel'; cType?: 'voice' }): VoiceChannel | null;
    public parseMention(id: Snowflake, options: ParseMentionOptions & { type: 'channel'; cType?: 'category' }): CategoryChannel | null;
    public playMusic(client: ReknownClient, guild: Guild, music: MusicObject, track: Track, ended?: boolean): void;
    public sendLog(client: ReknownClient, embed: MessageEmbed, guild: Guild): Promise<void>;
    public sendSong(music: MusicObject, message: Message, song: Track, user: ClientUser): void;
    public updateRow(client: ReknownClient, table: string, changes: { [ column: string ]: any }, filters: { [ column: string ]: any }): void;
    public uppercase(str: string): string;
  }

  type CommandCategory = 'Documentation'
      | 'Fun'
      | 'Levelling'
      | 'Miscellaneous'
      | 'Moderation'
      | 'Utility';

  interface ConfigObject {
    contributors: Snowflake[];
    embedColor: string;
    ownerID: Snowflake;
    prefix: string;
    suggestions: Snowflake;
  }

  interface HelpObj {
    aliases: string[];
    category: CommandCategory;
    desc: string;
    dm?: true;
    private?: boolean;
    usage: string;
  }

  interface LevelRow {
    guildid: Snowflake;
    level: number;
    points: number;
    userid: Snowflake;
  }

  interface LogChannelRow {
    channelid: Snowflake;
    guildid: Snowflake;
  }

  interface MusicObject {
    equalizer: number;
    looping: boolean;
    player?: Player;
    queue: Track[];
    volume: number;
  }

  interface ParseMentionOptions {
    client?: ReknownClient;
    cType?: 'text' | 'voice' | 'category';
    guild?: Guild;
    type: 'member' | 'user' | 'role' | 'channel';
  }

  interface ReknownCommand {
    help: HelpObj;
    run: (client: ReknownClient, message: Message, args: string[]) => void;
  }

  interface ReknownEvent {
    run: (...args: any) => void;
  }

  interface ToggleRow {
    bool: boolean;
    guildid: Snowflake;
  }

  interface WebhookRow {
    channelid: Snowflake;
    guildid: Snowflake;
    webhookid: Snowflake;
  }

  interface WelcomeChannelRow {
    channel: Snowflake;
    guildid: Snowflake;
  }
}
