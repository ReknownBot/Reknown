declare module 'ReknownBot' {
  import { CategoryChannel, ClientUser, Guild, GuildChannel, GuildMember, Message, MessageEmbed, PermissionString, Role, Snowflake, TextChannel, User, VoiceChannel } from 'discord.js';
  import { Player, Track } from 'lavalink';
  type Client = import('../structures/client').default;

  type CommandCategory = 'Documentation'
      | 'Economy'
      | 'Fun'
      | 'Levelling'
      | 'Miscellaneous'
      | 'Music'
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
    togglable: boolean;
    usage: string;
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
    endsat: number;
    userid: string;
  }

  interface RowDisabledCommands {
    command: string;
    guildid: string;
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
    guildid: string;
    msg: string;
  }

  interface RowPrefix {
    customprefix: string;
    guildid: string;
  }

  interface RowStarboard {
    editid: Snowflake;
    msgid: Snowflake;
  }

  interface RowToggle {
    bool: boolean;
    guildid: Snowflake;
  }

  interface RowWebhook {
    channelid: Snowflake;
    guildid: Snowflake;
    webhookid: Snowflake;
  }
}
