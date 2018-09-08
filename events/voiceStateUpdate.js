module.exports = async (Client, oldVoice, newVoice) => {
    const oldvc = oldVoice.channel,
        newvc = newVoice.channel,
        guild = oldVoice.member.guild;

    // If the voice state update was not in a guild
    if (!guild) return;

    // If it was a join
    if (!oldvc && newvc) return;

    // If the old vc did not include the bot
    if (!oldvc.members.has(Client.bot.user.id)) return;

    // If the member that was changed was the bot (Moved)
    if (oldVoice.member.id === Client.bot.user.id && oldvc && newvc)
        client.guilds[newVoice.member.guild.id].voiceChannel = newvc;

    if (oldvc.members.filter(m => !m.user.bot).size === 0) {
        const server = Client.musicfn.guilds[guild.id];
        server.voiceChannel = null;
        server.dispatcher = null;
        server.skips = 0;
        server.skippers = [];
        server.looping = false;
        server.queueNames = [];
        server.queueIDs = [];
    }
}