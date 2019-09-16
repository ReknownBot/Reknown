declare module 'ReknownBot' {
  import { Message, Snowflake } from 'discord.js';

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

  interface PrefixRow {
    customprefix: string;
    guildid: Snowflake;
  }

  interface ReknownCommand {
    help: HelpObj;
    run: (client: import('../structures/client').default, message: Message, args: string[]) => void;
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
