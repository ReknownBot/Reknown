module.exports = async (Client, message, args) => {
    // Defines "voiceChannel" as the voice channel the member is in
    const voiceChannel = message.member.voice.channel;

    // If the member is not in a voice channel, return and send a message
    if (!voiceChannel) return message.reply('You have to be in a voice channel to use this!');

    // Gets the permissions for the bot in the voice channel
    const perms = voiceChannel.permissionsFor(message.client.user);

    // Checks for perms
    if (!perms.has('CONNECT')) return message.reply('I do not have permissions to join the voice channel!');
    if (!perms.has('SPEAK')) return message.reply('I do not have permissions to speak in that voice channel!');

    // If there is no args
    if (!args[1]) return message.reply('You have to provide a link or a title for me to play!');

    // If someone is searching a video right now
    if (Client.musicfn.guilds[message.guild.id].searching)
        // Send a message
        return message.reply('Someone is using the search function right now, please wait until they finish.');

    // Defines "query" as the search / link
    let query = args.slice(1).join(' ');
    // Checks if it's not a link
    if (!await Client.musicfn.isValidYT(query)) {
        // Searches the video and updates "query" as the return value
        query = await Client.musicfn.search_video(query, Client, message);
    }

    // If no results were found
    if (!query) return message.reply('I did not find any results!');

    switch (query) {
        // If the search was cancelled
        case 'stopped':
            return message.reply(':ok_hand:, Cancelling search.');
            break;
        // If no reaction was collected
        case 'noR':
            return message.reply('No reaction was collected, aborting command.');
            break;
        // If the search result was invalid
        case 'invalid':
            return message.reply('That search result is invalid!');
            break;
    }

    // Joins the voice channel, defines "connection" as the returned value (VoiceConnection)
    let connection = await voiceChannel.join();

    // Plays music
    Client.musicfn.playMusic(query, message, Client, connection);
}

module.exports.help = {
    name: 'play',
    desc: 'Plays music.',
    category: 'music',
    usage: '?play <URL, Title, or ID of video>',
    aliases: []
}