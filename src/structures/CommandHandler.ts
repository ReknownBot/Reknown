import { readdirSync } from 'fs';
import type { Client, Message } from 'discord.js';
import { Collection, PermissionResolvable } from 'discord.js';

type CommandCategory = 'Documentation'
  | 'Economy'
  | 'Fun'
  | 'Levelling'
  | 'Miscellaneous'
  | 'Moderation'
  | 'Utility';

export interface HelpObj {
  aliases: string[];
  category: CommandCategory;
  desc: string;
  dm?: true;
  private?: boolean;
  togglable: boolean;
  usage: string;
}

interface ReknownCommand {
  help: HelpObj;
  memberPerms: PermissionResolvable[];
  permissions: PermissionResolvable[];
  run: (client: Client, message: Message, args: string[]) => void;
}

export default class CommandHandler extends Collection<string, ReknownCommand> {
  public constructor () {
    super();

    this.rawCategories = readdirSync('./dist/commands');
    this.rawCategories.forEach(c => readdirSync(`./dist/commands/${c}`).forEach(cmd => {
      this.list.push(cmd.slice(0, -3));
      const command: ReknownCommand = require(`../commands/${c}/${cmd}`); // eslint-disable-line @typescript-eslint/no-var-requires, global-require
      this.set(cmd.slice(0, -3), command);
      command.help.aliases.forEach(alias => this.aliases[alias] = cmd.slice(0, -3));
      this.aliases[cmd.slice(0, -3)] = cmd.slice(0, -3);

      if (!this.categories.includes(command.help.category)) this.categories.push(command.help.category);
    }));
  }

  public aliases: { [ alias: string ]: string } = {};

  public categories: CommandCategory[] = [];

  public list: string[] = [];

  public rawCategories: string[] = [];
}
