module.exports = async (Client, message, args) => {
    // Checks for perms
    if (!await Client.checkPerms('ban', 'mod', message.member))
        // Sends a message
        return message.reply(':x: Sorry, but you do not have the `mod.ban` permission.');

    if (!Client.checkClientPerms(message.channel, 'BAN_MEMBERS'))
        return message.reply('I do not have enough permissions!');

    // If no user input was detected
    if (!args[1])
        // Sends a message
        return message.reply('You have to include a member for me to ban!');

    if (!message.guild.owner)
        message.guild.owner = message.guild.members.fetch({
            user: message.guild.ownerID,
            cache: true
        });

    // Defines "regex" as a new regular expression
    const regex = new RegExp('--force', 'g');

    // If the force option was not called
    if (!Client.matchInArray(regex, args)) {
        try {
            // Gets the member
            const member = await message.guild.members.fetch({
                user: args[1] ? args[1].replace(/[<>@!?]/g, "") : 'placeholder',
                cache: true
            });

            // If the mentioned member's roles is higher than the message's author's roles AND the message's author is not the owner
            if (member.roles.highest.position >= message.member.roles.highest.position && message.member !== message.guild.owner)
                // Send a message
                return message.reply('Your role position is not high enough!');

            // If the mentioned user is the owner
            if (member === message.guild.owner)
                // Send a message
                return message.reply('I cannot ban an owner!');

            // If the mentioned user was the message author
            if (member === message.member)
                return message.reply('You cannot ban yourself!');

            // If the bot's role position is lower or equal to the member
            if (message.guild.me.roles.highest.position <= member.roles.highest.position)
                return message.reply('My role position is not high enough!');

            const reason = args.slice(2).join(' ');
            
            // Bans the member
            member.ban({
                reason: reason
            });

            return message.channel.send(`Successfully banned ${member.user.tag}${reason ? ` for the reason of ${reason}` : '.'}`);
        } catch (e) {
            // If the member is not found in the guild
            return message.reply('That is not a valid member! (Looking for force ban? Call the option `--force`.)');
        }

        // If it was called
    } else {
        // Removes the option from args so it won't be in the reason
        args.splice(args.indexOf('--force'), 1);

        // Defines "userID" as the first user input
        const userID = args[1];

        // Creates a try/catch
        try {
            // Fetches the user (to check if it's valid & getting info)
            const user = await Client.bot.users.fetch(userID);

            // Defines "reason" as the optional reason
            const reason = args.slice(2).join(' ');

            // Bans the user
            message.guild.members.ban(user, {
                reason: reason
            });

            return message.channel.send(`Successfully force banned ${user.tag}${reason ? ` for the reason of ${reason}` : '.'}`);

            // If the user is not found
        } catch (e) {
            return message.reply('That is not a valid ID!');
        }
    }
}

module.exports.help = {
    name: 'ban',
    desc: 'Bans a member.',
    category: 'moderation',
    usage: '?ban <Member> [Reason] [--<option>]',
    options: {
        force: 'Force bans the member, i.e bans even when the member is not in the server. An ID is required to be provided if this is the case.'
    },
    aliases: []
}