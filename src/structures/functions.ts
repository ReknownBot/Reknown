import type ColumnTypes from '../typings/ColumnTypes';
import type { GuildMessage } from '../Constants';
import type { MusicObject } from './client';
import type { QueryResult } from 'pg';
import type ReknownClient from './client';
import type { Track } from 'lavalink';
import { embedColor } from '../config.json';
import type { CategoryChannel, ClientUser, Guild, GuildChannel, GuildMember, Message, PermissionString, Role, Snowflake, User, VoiceChannel } from 'discord.js';
import { Client, MessageEmbed, TextChannel, Util } from 'discord.js';
import { parsedPerms, tables } from '../Constants';

interface ParseMentionOptions {
  client?: Client;
  cType?: 'text' | 'voice' | 'category';
  guild?: Guild;
  type: 'member' | 'user' | 'role' | 'channel';
}

export class Functions {
  public badArg (message: Message | GuildMessage, argNum: number, desc: string): void {
    if (message.channel.type === 'text' && !message.channel.permissionsFor(message.guild!.me!)!.has('EMBED_LINKS')) {
      message.channel.send(`Argument **#${argNum}** was invalid. Here's what was wrong with it.\n\n**${desc}**`);
      return;
    }

    const embed = new MessageEmbed()
      .setColor(embedColor)
      .setDescription(`Argument #${argNum} is invalid. Here's what was wrong with it.\n\n**${desc}**`)
      .setFooter(`Executed by ${message.author.tag}`, message.author.displayAvatarURL())
      .setTimestamp()
      .setTitle(`Argument #${argNum} Incorrect`);

    message.channel.send(embed);
  }

  public endSession (music: MusicObject): void {
    music.queue = [];
    music.player!.leave();
    music.player!.stop();
  }

  public formatNum (num: number): string {
    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
  }

  public getFullTime (timeLeft: number): string {
    const s = Math.ceil(timeLeft / 1000 % 60);
    const m = Math.floor(timeLeft / (1000 * 60) % 60);
    const h = Math.floor(timeLeft / (1000 * 60 * 60) % 24);
    const d = Math.floor(timeLeft / (1000 * 60 * 60 * 24));

    return `${d}d ${h}h ${m}m ${s}s`;
  }

  public async getMuteRole (client: ReknownClient, guild: Guild): Promise<Role | null> {
    const row = await client.functions.getRow<ColumnTypes['MUTEROLE']>(client, tables.MUTEROLE, {
      guildid: guild.id
    });
    const role = row ? guild.roles.cache.get(row.roleid) : guild.roles.cache.find(ro => ro.name === 'Muted');
    if (!role || guild.me!.roles.highest.comparePositionTo(role) <= 0) return null;

    return role;
  }

  public async getPrefix (client: ReknownClient, id: Snowflake): Promise<string> {
    if (client.prefixes[id]) return client.prefixes[id];
    const row = await client.functions.getRow<ColumnTypes['PREFIX']>(client, tables.PREFIX, {
      guildid: id
    });
    return client.prefixes[id] = row ? row.customprefix : client.config.prefix;
  }

  public async getRow<T> (client: ReknownClient, table: string, filters: Partial<T>): Promise<T | null> {
    const query = `SELECT * FROM ${table} WHERE ${Object.keys(filters).map((rowName, i) => `${rowName} = $${i + 1}`).join(' AND ')}`;
    const { rows } = await client.query<T>(query, Object.values(filters));
    return rows.length < 0 ? rows[0] : null;
  }

  public getTime (timeLeft: number): string {
    const s = Math.ceil(timeLeft / 1000 % 60);
    const m = Math.floor(timeLeft / (1000 * 60) % 60);
    const h = Math.floor(timeLeft / (1000 * 60 * 60));

    return `${h}h ${m}m ${s}s`;
  }

  public noArg (message: Message | GuildMessage, argNum: number, desc: string): void {
    if (message.channel.type === 'text' && !message.channel.permissionsFor(message.guild!.me!)!.has('EMBED_LINKS')) {
      message.channel.send(`Argument **#${argNum}** was missing. It is supposed to be **${desc}**`);
      return;
    }

    const embed = new MessageEmbed()
      .setColor(embedColor)
      .setDescription(`Argument #${argNum} is missing. It is supposed to be **${desc}**`)
      .setFooter(`Executed by ${message.author.tag}`, message.author.displayAvatarURL())
      .setTimestamp()
      .setTitle(`Argument #${argNum} Missing`);

    message.channel.send(embed);
  }

  public noClientPerms (message: Message, perms: PermissionString[], channel?: GuildChannel): void {
    const formatted = perms.map(p => `\`${parsedPerms[p as keyof typeof parsedPerms]}\``).join('\n');
    if (channel) return void message.channel.send(`I do not have the required permissions in ${channel.type === 'text' ? channel : `**${channel.name}**`}.\nThe permissions are:\n\n${formatted}`);
    message.channel.send(`I do not have the required permissions.\nThe permissions are:\n\n${formatted}`);
  }

  public noPerms (message: Message, perms: PermissionString[], channel?: GuildChannel): void {
    const formatted = perms.map(p => `\`${parsedPerms[p as keyof typeof parsedPerms]}\``).join('\n');
    if (channel) {
      message.channel.send(`You do not have the required permissions in ${channel.type === 'text' ? channel : `**${Util.escapeMarkdown(channel.name)}**`}.\nThe permissions are:\n\n${formatted}`);
      return;
    }

    message.channel.send(`You do not have the required permissions.\nThe permissions are:\n\n${formatted}`);
  }

  public parseArgs (str: string): string[] {
    const cmd = str.split(/\s+/)[0];
    str = str.slice(cmd.length);
    const regex = /"(.+?(?<!\\))"(?!\S)|(\S+)/gs;
    const matches = [ ...str.matchAll(regex) ].map(s => {
      const match = s[1] || s[0];
      if (match.includes(' ')) return match.replace(/\\"/gs, '"').replace(/\\ /gs, ' ');
      return match;
    });

    return [ cmd, ...matches ];
  }

  public parseMention (id: Snowflake, options: ParseMentionOptions & { cType?: 'text'; guild: Guild; type: 'channel' }): TextChannel | null;
  public parseMention (id: Snowflake, options: ParseMentionOptions & { cType?: 'voice'; guild: Guild; type: 'channel' }): VoiceChannel | null;
  public parseMention (id: Snowflake, options: ParseMentionOptions & { cType?: 'category'; guild: Guild; type: 'channel' }): CategoryChannel | null;
  public parseMention (id: Snowflake, options: ParseMentionOptions & { guild: Guild; type: 'member' }): Promise<GuildMember | null>;
  public parseMention (id: Snowflake, options: ParseMentionOptions & { guild: Guild; type: 'role' }): Role | null;
  public parseMention (id: Snowflake, options: ParseMentionOptions & { client: ReknownClient; type: 'user' }): Promise<User | null>;
  public parseMention (id: Snowflake, options: ParseMentionOptions): any {
    if (!parseInt(id) && !this.regexArr.some(regex => regex.test(id))) {
      if ([ 'member', 'user' ].includes(options.type)) return Promise.reject(null);
      return null;
    }

    let parsedId: string;
    if (!parseInt(id)) {
      parsedId = id.slice(2, -1);
      if (id.startsWith('<@!') || id.startsWith('<@&')) parsedId = id.slice(3, -1);
    } else parsedId = id;
    const cType = options.cType || 'text';

    switch (options.type) {
      case 'member': return options.guild!.members.fetch(parsedId);
      case 'user': return options.client!.users.fetch(parsedId);
      case 'role': return options.guild!.roles.cache.get(parsedId);
      case 'channel': return options.guild!.channels.cache.find(c => c.id === parsedId && c.type === cType);
      default: return false;
    }
  }

  public async playMusic (client: ReknownClient, guild: Guild, music: MusicObject, song: Track, ended?: boolean): Promise<void> {
    if (!ended) {
      music.queue.push(song);
      if (music.queue.length > 1) return;
    }

    await music.player!.play(song.track);
    music.player!.setVolume(music.volume);

    music.player!.once('event', async d => {
      if (d.reason === 'REPLACED') return;
      if (!guild.voice || !guild.voice.channel) return client.functions.endSession(music);
      if (music.looping && music.queue.length > 0) music.queue.push(music.queue.shift()!);
      else music.queue.shift();

      if (music.queue.length > 0) return setTimeout(this.playMusic.bind(this), 500, client, guild, music, music.queue[0], true);
      setTimeout(client.functions.endSession, 800, music);
    });
  }

  public async register (client: ReknownClient, userid: Snowflake): Promise<ColumnTypes['ECONOMY']> {
    return (await client.query(`INSERT INTO ${tables.ECONOMY} (balance, userid) VALUES ($1, $2) RETURNING *`, [ 0, userid ])).rows[0];
  }

  public async sendLog (client: ReknownClient, embed: MessageEmbed, guild: Guild) {
    const toggledRow = await client.functions.getRow<ColumnTypes['TOGGLE']>(client, tables.LOGTOGGLE, {
      guildid: guild.id
    });
    if (!toggledRow || !toggledRow.bool) return;

    const channelRow = await client.functions.getRow<ColumnTypes['CHANNEL']>(client, tables.LOGCHANNEL, {
      guildid: guild.id
    });
    const channel = (channelRow ?
      client.channels.cache.get(channelRow.channelid) :
      guild.channels.cache.find(c => c.name === 'action-log' && c.type === 'text')) as TextChannel | undefined;
    if (!channel) return;
    if (!channel.permissionsFor(client.user!)!.has('MANAGE_WEBHOOKS')) return;
    const webhooks = await channel.fetchWebhooks();
    let webhookRow = await client.functions.getRow<ColumnTypes['WEBHOOK']>(client, tables.LOGWEBHOOK, {
      channelid: channel.id
    });
    let webhook;
    if (!webhookRow || !webhooks.has(webhookRow.webhookid)) {
      webhook = await channel.createWebhook('Reknown Logs', {
        avatar: client.user!.displayAvatarURL({ size: 2048 }),
        reason: 'Reknown Logs'
      });
      webhookRow = (await client.functions.updateRow<ColumnTypes['WEBHOOK']>(client, tables.LOGWEBHOOK, {
        channelid: channel.id,
        guildid: guild.id,
        webhookid: webhook.id
      }, {
        channelid: channel.id
      })).rows[0];
    } else webhook = webhooks.get(webhookRow.webhookid)!;

    webhook.send(embed);
  }

  public sendSong (music: MusicObject, message: GuildMessage, song: Track, user: ClientUser): void {
    if (!message.channel.permissionsFor(user)!.has('EMBED_LINKS')) {
      if (music.queue.length === 0) message.channel.send(`**Now Playing:** ${Util.escapeMarkdown(song.info.title)} by \`${Util.escapeMarkdown(song.info.author)}\``);
      else message.channel.send(`**Added to Queue:** ${Util.escapeMarkdown(song.info.title)} by \`${Util.escapeMarkdown(song.info.author)}\``);

      return;
    }

    const embed = new MessageEmbed()
      .addFields([
        {
          name: 'Author',
          value: song.info.author
        },
        {
          name: 'Duration',
          value: `${Math.round(song.info.length / 6000) / 10}m`
        }
      ])
      .setColor(embedColor)
      .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL());
    if (music.queue.length === 0) embed.setAuthor(`Now Playing: ${song.info.title}`, undefined, song.info.uri);
    else embed.setAuthor(`Added to Queue: ${song.info.title}`, undefined, song.info.uri);

    const thumbnail = song.info.uri.includes('youtube') ?
      `https://i.ytimg.com/vi/${song.info.identifier}/hqdefault.jpg` :
      null;
    if (thumbnail) embed.setThumbnail(thumbnail);

    message.channel.send(embed);
  }

  public async unmute (client: ReknownClient, member: GuildMember): Promise<void> {
    client.mutes.delete(member.id);
    client.query(`DELETE FROM ${tables.MUTES} WHERE guildid = $1`, [ member.guild.id ]);
    if (!member.guild.me!.hasPermission('MANAGE_ROLES')) return;
    await member.guild.members.fetch();
    if (!member.guild.members.cache.has(member.id)) return;

    const role = await this.getMuteRole(client, member.guild);
    if (!role || !member.roles.cache.has(role.id)) return;
    member.roles.remove(role);
  }

  public updateRow<T>(client: ReknownClient, table: string, changes: T, filters: Partial<T>): Promise<QueryResult<T>> {
    const columns = Object.keys(changes);
    const values = Object.values(changes);
    if (table === 'prefix') {
      client.prefixes[(changes as unknown as ColumnTypes['PREFIX']).guildid] = (changes as unknown as ColumnTypes['PREFIX']).customprefix;
    }

    let i = 0;
    return client.query<T>(`
      INSERT INTO ${table} (${columns})
      VALUES (${columns.map(c => (i += 1, `$${i}`))})
      ON CONFLICT (${Object.keys(filters)}) DO UPDATE
        SET ${columns.map(c => (i += 1, `${c} = $${i}`))}
      RETURNING *
    `, [ ...values, ...Object.values(filters) ]);
  }

  public uppercase (str: string): string {
    return str[0].toUpperCase() + str.slice(1);
  }

  private regexArr = [ /<@!?(\d{17,19})>/, /<@&(\d{17,19})>/, /<#(\d{17,19})>/ ];
}
