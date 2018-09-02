module.exports = {
  help: "This command tells you info about me!",
  func: async (client, message, args, unknownCommand, mess, sql, Discord, fs, PREFIX, bool) => {
    try {
      async function info(sMessage) {
        let seconds = Math.floor((client.bot.uptime / 1000) % 60);
        let minutes = Math.floor((client.bot.uptime / 1000 / 60) % 60);
        let hours = Math.floor((client.bot.uptime / 1000 / 60 / 60) % 24);
        let days = Math.floor(client.bot.uptime / 1000 / 60 / 60 / 24);
        let credit = await client.bot.users.fetch("284857002977525760");

        let embed = new Discord.MessageEmbed()
          .setTitle("Bot Info:")
          .setColor(0x00FFFF)
          .addField("Creator", "ᴊʏɢᴜʏ#9535 [Twitter](https://twitter.com/Jyguy_)", true)
          .addField("Invite", "https://discordbots.org/bot/338832551278018581")
          .addField("Library", "Discord.js", true)
          .addField("Servers", client.bot.guilds.size, true)
          .addField("Credits & Supporters", `${credit.tag} for helping me with my host and helping with fuzzy strings.`, true)
          .addField("Support Server", "https://discord.gg/n45fq9K", true)
          .addField("Uptime", `${days} days, ${hours} hours, ${minutes} minutes, and ${seconds} seconds.`, true)
          .addField("RAM", `Used: ${Math.round(process.memoryUsage().heapUsed / 1024 / 1024 * 100) / 100}MB`, true)
          .addField("Donate", "[PayPal](https://www.paypal.me/jyguy)", true)
          .setTimestamp()
          .setFooter(`Requested by ${message.author.tag}`);

        client.editMsg(sMessage, embed, message);
      }

      if (bool) {
        args = message.content.slice(PREFIX.length).split(' ');
        for (let i = args.length - 1; i--;)
                    if (args[i] == '')
                        args.splice(i, 1);
        let msgToEdit;
        try {
          msgToEdit = await message.channel.messages.fetch(client.msgEdit[message.id]);
        } catch (e) {
          msgToEdit = null;
        }
        info(msgToEdit);
      } else {
        info(message);
      }
    } catch (e) {
      let rollbar = new client.Rollbar(client.rollbarKey);
      rollbar.error("Something went wrong in info.js", e);
      console.error(e);
      message.channel.send(`Something went wrong while executing the command: \`${PREFIX}info\`\n\n\`\`\`xl\n${e}\n\`\`\``);
    }
  },
  jyguyOnly: 0,
  category: "misc"
}