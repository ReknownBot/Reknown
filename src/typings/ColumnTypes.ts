import type { Snowflake } from 'discord.js';

export default interface ColumnTypes {
  BIOGRAPHY: {
    email: string;
    summary: string;
    twitter: string;
    userid: string;
  };

  CHANNEL: {
    channelid: Snowflake;
    guildid: Snowflake;
  };

  COOLDOWN: {
    endsat: string;
    userid: Snowflake;
  };
  
  DISABLEDCOMMANDS: {
    command: string;
    guildid: Snowflake;
  };

  ECONOMY: {
    balance: number;
    userid: Snowflake;
  };

  LEVEL: {
    guildid: Snowflake;
    level: number;
    points: number;
    userid: Snowflake;
  };

  MSG: {
    guildid: Snowflake;
    msg: string;
  };

  MUTEROLE: {
    guildid: Snowflake;
    roleid: Snowflake;
  };

  MUTES: {
    endsat: string;
    guildid: Snowflake;
    userid: Snowflake;
  };

  PREFIX: {
    customprefix: string;
    guildid: Snowflake;
  };

  STARBOARD: {
    editid: Snowflake;
    msgid: Snowflake;
  };

  TOGGLE: {
    bool: boolean;
    guildid: Snowflake;
  };

  WARNINGS: {
    guildid: Snowflake;
    userid: Snowflake;
    warnedat: string;
    warnedby: Snowflake;
    warnreason: string | null;
  };

  WEBHOOK: {
    channelid: Snowflake;
    guildid: Snowflake;
    webhookid: Snowflake;
  };
}
