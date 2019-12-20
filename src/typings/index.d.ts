declare module 'ReknownBot' {
  import { CategoryChannel, ClientUser, Guild, GuildChannel, GuildMember, Message, MessageEmbed, PermissionString, Role, Snowflake, TextChannel, User, VoiceChannel } from 'discord.js';
  import { Player, Track } from 'lavalink';
  type ReknownClient = import('../structures/client').default;

  type CommandCategory = 'Documentation'
      | 'Economy'
      | 'Fun'
      | 'Levelling'
      | 'Miscellaneous'
      | 'Music'
      | 'Moderation'
      | 'Utility';

  interface BiographyRow {
    email: string;
    summary: string;
    twitter: string;
    userid: string;
  }

  interface ChannelRow {
    channelid: Snowflake;
    guildid: Snowflake;
  }

  interface ConfigObject {
    contributors: Snowflake[];
    embedColor: string;
    ownerID: Snowflake;
    prefix: string;
    suggestions: Snowflake;
  }

  interface CooldownRow {
    endsat: number;
    userid: string;
  }

  interface DisabledCommandsRow {
    command: string;
    guildid: string;
  }

  interface EconomyRow {
    balance: number;
    userid: Snowflake;
  }

  interface HelpObj {
    aliases: string[];
    category: CommandCategory;
    desc: string;
    dm?: true;
    private?: boolean;
    togglable: boolean;
    usage: string;
  }

  interface LevelRow {
    guildid: Snowflake;
    level: number;
    points: number;
    userid: Snowflake;
  }

  interface MsgRow {
    guildid: string;
    msg: string;
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

  interface PrefixRow {
    customprefix: string;
    guildid: string;
  }

  interface ReknownCommand {
    help: HelpObj;
    permissions: PermissionString[];
    run: (client: ReknownClient, message: Message, args: string[]) => void;
  }

  interface ReknownEvent {
    run: (...args: any) => void;
  }

  interface StarMessageRow {
    editid: Snowflake;
    msgid: Snowflake;
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
}
