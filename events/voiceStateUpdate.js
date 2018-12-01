module.exports = (Client) => {
  return Client.bot.on('voiceStateUpdate', (oldVoice, newVoice) => {
    const oldvc = oldVoice.channel;
    const newvc = newVoice.channel;
    const guild = oldVoice.guild;

    if (!guild) return;
    if (!oldvc && newvc) return;
    if (!oldvc && !newvc) return;
    if (!oldvc.members.has(Client.bot.user.id)) return;

    const server = Client.musicfn.guilds[guild.id];

    if (oldVoice.member.id === Client.bot.user.id && oldvc && newvc) {
      server.voiceChannel = newvc;
    }

    if (oldvc.members.filter(m => !m.user.bot).size === 0) {
      server.voiceChannel.leave();
      server.voiceChannel = null;
      server.dispatcher = null;
      server.skips = 0;
      server.skippers = [];
      server.looping = false;
      server.queueNames = [];
      server.queueIDs = [];
      server.paused = false;
    }
  });
};
