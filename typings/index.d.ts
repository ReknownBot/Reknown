declare module 'ReknownBot' {
  import { Message, Snowflake, GuildChannel, Guild, GuildMember, Role, User, MessageEmbed } from 'discord.js';
  type ReknownClient = import('../structures/client').default;

  export class ReknownFunctions {
    public badArg(
      message: Message,
      argNum: number,
      desc: string
    ): void;

    public formatNum(
      num: number
    ): string;

    public getPrefix(
      client: ReknownClient,
      id: Snowflake
    ): Promise<string>;

    public noArg(
      message: Message,
      argNum: number,
      desc: string
    ): void;

    public noClientPerms(
      message: Message,
      perms: string[],
      channel?: GuildChannel
    ): void;

    public parseMention(
      id: Snowflake,
      guild: Guild,
      options: ParseMentionOptions
    ): Promise<GuildMember> | Promise<User> | Role | GuildChannel | Promise<false> | false;

    public sendLog(
      client: ReknownClient,
      embed: MessageEmbed,
      guild: Guild
    ): Promise<void>;

    public uppercase(
      str: string
    ): string;
  }

  type CommandCategory = 'Documentation' | 'Fun' | 'Levelling' | 'Miscellaneous' | 'Moderation' | 'Utility';

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

  interface ParseMentionOptions {
    client?: ReknownClient;
    cType?: 'text' | 'voice' | 'category';
    type: 'member' | 'user' | 'role' | 'channel';
  }

  interface PrefixRow {
    customprefix: string;
    guildid: Snowflake;
  }

  interface ReknownCommand {
    help: HelpObj;
    run: (client: ReknownClient, message: Message, args: string[]) => void;
  }

  interface ReknownEvent {
    run: (...args) => void;
  }

  interface ToggleRow {
    bool: boolean;
    guildid: Snowflake;
  }

  interface WelcomeChannelRow {
    channel: Snowflake;
    guildid: Snowflake;
  }
}
