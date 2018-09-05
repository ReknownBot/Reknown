module.exports = {
    func: (client, sql, Discord) => {
        client.bot.on('voiceStateUpdate', (oldVoice, newVoice) => {
            try {
                if (!oldVoice.member.guild) return;
                if (newVoice.member === newVoice.member.guild.me) return;
                if (!oldVoice.channel && !newVoice.channel) return;
                if (oldVoice.channel && newVoice.channel) return;
                if (!oldVoice.channel && newVoice.channel) return;
                if (!oldVoice.channel.members.has(client.bot.user.id)) return;
                if (oldVoice.channel !== newVoice.channel && newVoice.channel && oldVoice.channel) {
                    client.guilds[newVoice.member.guild.id].voiceChannel = newVoice.channel;
                }
                if (oldVoice.channel.members.filter(m => !m.user.bot).size === 0) {
                    if (!client.guilds[newVoice.member.guild.id]) return;
                    let guild = client.guilds[newVoice.member.guild.id];
                    guild.queue = [];
                    guild.queueNames = [];
                    guild.skipReq = 0;
                    guild.skippers = [];
                    guild.isPlaying = false;
                    guild.volume = 50;
                    guild.dispatcher ? guild.dispatcher.end() : undefined;
                    oldVoice.channel.leave();
                }
            } catch (e) {
                console.error(e);
                let rollbar = new client.Rollbar(client.rollbarKey);
                rollbar.error("Something went wrong in grole.js", e);
            }
        });
    }
}