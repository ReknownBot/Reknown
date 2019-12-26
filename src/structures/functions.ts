import { Track } from 'lavalink';
import { embedColor } from '../config.json';
import { CategoryChannel, ClientUser, Guild, GuildChannel, GuildMember, Message, MessageEmbed, Role, Snowflake, TextChannel, User, Util, VoiceChannel } from 'discord.js';
import { MusicObject, ParseMentionOptions, ReknownClient, RowChannel, RowEconomy, RowPrefix, RowToggle, RowWebhook } from 'ReknownBot';
import { parsedPerms, tables } from '../Constants';

export class Functions {
  public badArg (message: Message, argNum: number, desc: string): void {
    if (message.channel instanceof TextChannel && !message.channel.permissionsFor(message.guild!.me!)!.has('EMBED_LINKS')) return void message.channel.send(`Argument **#${argNum}** was invalid. Here's what was wrong with it.\n\n**${desc}**`);

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

  public async getPrefix (client: ReknownClient, id: Snowflake): Promise<string> {
    if (client.prefixes[id]) return client.prefixes[id];
    const row = await client.functions.getRow<RowPrefix>(client, tables.PREFIX, {
      guildid: id
    });
    return client.prefixes[id] = row ? row.customprefix : client.config.prefix;
  }

  public async getRow<T> (client: ReknownClient, table: string, filters: Partial<T>): Promise<T | null> {
    const query = `SELECT * FROM ${table} WHERE ${Object.keys(filters).map((rowName, i) => `${rowName} = $${i + 1}`).join(' AND ')}`;
    const { rows } = await client.query(query, Object.values(filters));
    return rows ? rows[0] : null;
  }

  public getTime (timeLeft: number): string {
    const h = Math.floor(timeLeft / 1000 / 60 / 60 % 24);
    const m = Math.floor(timeLeft / 1000 / 60 % 60);
    const s = Math.floor(timeLeft / 1000 % 60);

    return `${h}h ${m}m ${s}s`;
  }

  public noArg (message: Message, argNum: number, desc: string): void {
    if (message.channel instanceof TextChannel && !message.channel.permissionsFor(message.guild!.me!)!.has('EMBED_LINKS')) return void message.channel.send(`Argument **#${argNum}** was missing. It is supposed to be **${desc}**`);

    const embed = new MessageEmbed()
      .setColor(embedColor)
      .setDescription(`Argument #${argNum} is missing. It is supposed to be **${desc}**`)
      .setFooter(`Executed by ${message.author!.tag}`, message.author!.displayAvatarURL())
      .setTimestamp()
      .setTitle(`Argument #${argNum} Missing`);

    message.channel.send(embed);
  }

  public noClientPerms (message: Message, perms: (keyof typeof parsedPerms)[], channel?: GuildChannel): void {
    const formatted = perms.map(p => `\`${parsedPerms[p as keyof typeof parsedPerms]}\``).join('\n');
    if (channel) return void message.channel.send(`I do not have the required permissions in ${channel.type === 'text' ? channel : `**${channel.name}**`}.\nThe permissions are:\n\n${formatted}`);
    message.channel.send(`I do not have the required permissions.\nThe permissions are:\n\n${formatted}`);
  }

  public noPerms (message: Message, perms: (keyof typeof parsedPerms)[], channel?: GuildChannel): void {
    const formatted = perms.map(p => `\`${parsedPerms[p as keyof typeof parsedPerms]}\``).join('\n');
    if (channel) return void message.channel.send(`You do not have the required permissions in ${channel.type === 'text' ? channel : `**${Util.escapeMarkdown(channel.name)}**`}.\nThe permissions are:\n\n${formatted}`);
    message.channel.send(`You do not have the required permissions.\nThe permissions are:\n\n${formatted}`);
  }

  public parseMention(id: Snowflake, options: ParseMentionOptions & { cType?: 'text'; guild: Guild; type: 'channel' }): TextChannel | null;
  public parseMention(id: Snowflake, options: ParseMentionOptions & { cType?: 'voice'; guild: Guild; type: 'channel' }): VoiceChannel | null;
  public parseMention(id: Snowflake, options: ParseMentionOptions & { cType?: 'category'; guild: Guild; type: 'channel' }): CategoryChannel | null;
  public parseMention(id: Snowflake, options: ParseMentionOptions & { guild: Guild; type: 'member' }): Promise<GuildMember | null>;
  public parseMention(id: Snowflake, options: ParseMentionOptions & { guild: Guild; type: 'role' }): Role | null;
  public parseMention(id: Snowflake, options: ParseMentionOptions & { client: ReknownClient; type: 'user' }): Promise<User | null>;
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
      case 'role': return options.guild!.roles.get(parsedId);
      case 'channel': return options.guild!.channels.find(c => c.id === parsedId && c.type === cType);
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
      client.functions.endSession(music);
    });
  }

  public async register (client: ReknownClient, userid: Snowflake): Promise<RowEconomy> {
    return (await client.query(`INSERT INTO ${tables.ECONOMY} (balance, userid) VALUES ($1, $2) RETURNING *`, [ 0, userid ])).rows[0];
  }

  public async sendLog (client: ReknownClient, embed: MessageEmbed, guild: Guild) {
    const toggledRow = await client.functions.getRow<RowToggle>(client, tables.LOGTOGGLE, {
      guildid: guild.id
    });
    if (!toggledRow || !toggledRow.bool) return;

    const channelRow = await client.functions.getRow<RowChannel>(client, tables.LOGCHANNEL, {
      guildid: guild.id
    });
    const channel = (channelRow ? client.channels.get(channelRow.channelid) : guild.channels.find(c => c.name === 'action-log' && c.type === 'text')) as TextChannel;
    if (!channel) return;
    if (!channel.permissionsFor(client.user!)!.has('MANAGE_WEBHOOKS')) return;
    const webhooks = await channel.fetchWebhooks();
    let webhookRow = await client.functions.getRow<RowWebhook>(client, tables.LOGWEBHOOK, {
      channelid: channel.id
    });
    let webhook;
    if (!webhookRow || !webhooks.has(webhookRow.webhookid)) {
      webhook = await channel.createWebhook('Reknown Logs', {
        avatar: client.user!.displayAvatarURL({ size: 2048 }),
        reason: 'Reknown Logs'
      });
      webhookRow = !webhookRow ?
        (await client.query(`INSERT INTO ${tables.LOGWEBHOOK} (channelid, guildid, webhookid) VALUES ($1, $2, $3) RETURNING *`, [ channel.id, guild.id, webhook.id ])).rows[0] :
        (await client.query(`UPDATE ${tables.LOGWEBHOOK} SET webhookid = $1 WHERE channelid = $2 RETURNING *`, [ webhook.id, channel.id ])).rows[0];
    } else webhook = webhooks.get(webhookRow.webhookid)!;

    webhook.send(embed);
  }

  public sendSong (music: MusicObject, message: Message & { channel: TextChannel }, song: Track, user: ClientUser): void {
    if (!message.channel.permissionsFor(user)!.has('EMBED_LINKS')) {
      if (music.queue.length === 0) return void message.channel.send(`**Now Playing:** ${Util.escapeMarkdown(song.info.title)} by \`${Util.escapeMarkdown(song.info.author)}\``);
      return void message.channel.send(`**Added to Queue:** ${Util.escapeMarkdown(song.info.title)} by \`${Util.escapeMarkdown(song.info.author)}\``);
    }

    const embed = new MessageEmbed()
      .addField('Author', song.info.author)
      .addField('Duration', `${Math.round(song.info.length / 6000) / 10}m`)
      .setColor(embedColor)
      .setFooter(`Requested by ${message.author!.tag}`, message.author!.displayAvatarURL());
    if (music.queue.length === 0) embed.setAuthor(`Now Playing: ${song.info.title}`, undefined, song.info.uri);
    else embed.setAuthor(`Added to Queue: ${song.info.title}`, undefined, song.info.uri);

    const thumbnail = song.info.uri.includes('youtube') ? `https://i.ytimg.com/vi/${song.info.identifier}/hqdefault.jpg` : null;
    if (thumbnail) embed.setThumbnail(thumbnail);

    message.channel.send(embed);
  }

  public async updateRow<T> (client: ReknownClient, table: string, changes: T, filters: Partial<T>): Promise<void> {
    const columns = Object.keys(changes);
    const values = Object.values(changes);
    // eslint-disable-next-line no-extra-parens
    if (table === 'prefix') client.prefixes[(changes as unknown as RowPrefix).guildid] = (changes as unknown as RowPrefix).customprefix;
    const row = await client.functions.getRow<any>(client, table, filters);
    if (row) client.query(`UPDATE ${table} SET ${columns.map((c, i) => `${c} = $${i + 1}`)} WHERE ${Object.keys(filters).map((c, i) => `${c} = $${i + columns.length + 1}`).join(' AND ')}`, [ ...values, ...Object.values(filters) ]);
    else client.query(`INSERT INTO ${table} (${columns}) VALUES (${columns.map((c, i) => `$${i + 1}`)})`, values);
  }

  public uppercase (str: string): string {
    return str[0].toUpperCase() + str.slice(1);
  }

  private regexArr = [ /<@!?(\d{17,19})>/, /<@&(\d{17,19})>/, /<#(\d{17,19})>/ ];
}
