declare module 'ReknownBot' {
  import type { CategoryChannel, ClientUser, Guild, GuildChannel, GuildMember, Message, MessageEmbed, PermissionString,
    Role, Snowflake, TextChannel, User, VoiceChannel } from 'discord.js';
  import type { Player, Track } from 'lavalink';
  type Client = import('../structures/client').default;

  type CommandCategory = 'Documentation'
    | 'Economy'
    | 'Fun'
    | 'Levelling'
    | 'Miscellaneous'
    | 'Music'
    | 'Moderation'
    | 'Utility';

  type EmoteName = 'online'
    | 'idle'
    | 'dnd'
    | 'offline';

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

  interface HelpObj {
    aliases: string[];
    category: CommandCategory;
    desc: string;
    dm?: true;
    private?: boolean;
    togglable: boolean;
    usage: string;
  }

  interface GuildMessage extends Message {
    channel: TextChannel;
    guild: Guild;
    member: GuildMember;
  }

  interface MusicObject {
    equalizer: number;
    looping: boolean;
    player?: Player;
    queue: Track[];
    volume: number;
  }

  interface ParseMentionOptions {
    client?: Client;
    cType?: 'text' | 'voice' | 'category';
    guild?: Guild;
    type: 'member' | 'user' | 'role' | 'channel';
  }

  interface ReknownCommand {
    help: HelpObj;
    memberPerms: PermissionString[];
    permissions: PermissionString[];
    run: (client: Client, message: Message, args: string[]) => void;
  }

  interface ReknownEvent {
    run: (...args: any) => void;
  }

  interface RowBiography {
    email: string;
    summary: string;
    twitter: string;
    userid: string;
  }

  interface RowChannel {
    channelid: Snowflake;
    guildid: Snowflake;
  }

  interface RowCooldown {
    endsat: string;
    userid: Snowflake;
  }

  interface RowDisabledCommands {
    command: string;
    guildid: Snowflake;
  }

  interface RowEconomy {
    balance: number;
    userid: Snowflake;
  }

  interface RowLevel {
    guildid: Snowflake;
    level: number;
    points: number;
    userid: Snowflake;
  }

  interface RowMsg {
    guildid: Snowflake;
    msg: string;
  }

  interface RowMuteRole {
    guildid: Snowflake;
    roleid: Snowflake;
  }

  interface RowMutes {
    endsat: string;
    guildid: Snowflake;
    userid: Snowflake;
  }

  interface RowPrefix {
    customprefix: string;
    guildid: Snowflake;
  }

  interface RowStarboard {
    editid: Snowflake;
    msgid: Snowflake;
  }

  interface RowToggle {
    bool: boolean;
    guildid: Snowflake;
  }

  interface RowWarnings {
    guildid: Snowflake;
    userid: Snowflake;
    warnedat: string;
    warnedby: Snowflake;
    warnreason: string?;
  }

  interface RowWebhook {
    channelid: Snowflake;
    guildid: Snowflake;
    webhookid: Snowflake;
  }
}
