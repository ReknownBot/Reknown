module.exports = {
    help: "Gives a member a role! (misc.grole Required) `Usage: ?grole <Member> <Role>`",
    func: async (client, message, args, unknownCommand, mess, sql, Discord, fs, PREFIX, bool) => {
        try {
            async function grolecmd(sMessage) {
                // Checks for the custom permission
                let bool2 = false;
                let i = 0;
                let prom = new Promise(resolve => {
                    message.member.roles.forEach(async role => {
                        let row = await sql.query('SELECT * FROM permissions WHERE roleID = $1 AND pName = $2 AND pCategory = $3', [role.id, "grole", "misc"]);
                        if ((row && row.bool) || message.member === message.guild.owner)
                            bool2 = true;
                        i++;
                        if (i === message.member.roles.size)
                            setTimeout(resolve, 10);
                    });
                });
                await prom;
                if (!bool2) return client.editMsg(sMessage, ":x:, Sorry, but you do not have the `misc.grole` permission.", message);
                // End of check

                if (!message.guild.me.hasPermission("MANAGE_ROLES")) return client.editMsg(sMessage, "I do not have enough permissions!", message);

                if (!args[1]) return client.editMsg(sMessage, "You have to supply a member for me to add a role to!", message);
                let sMember;
                try {
                    sMember = await message.guild.members.fetch(args[1] ? args[1].replace(/[<>@!?]/g, "") : null);
                } catch (e) {
                    sMember = null;
                }
                if (!sMember) return client.editMsg(sMessage, "That is not a valid member!", message);

                if (!args[2]) return client.editMsg(sMessage, "You have to supply a role for me to give this member!", message);
                let role = message.guild.roles.get(args[2] ? args[2].replace(/[<>&@]/g, "") : null) || message.guild.roles.find(r => r.name.toLowerCase() === args.slice(2).join(' '));
                if (!role) return client.editMsg(sMessage, "That is not a valid role!", message);
                if (role.position >= message.member.roles.highest.position && message.guild.owner !== message.member) return client.editMsg(sMessage, "Your role position is not high enough!", message);
                if (role.position >= message.guild.me.roles.highest.position) return client.editMsg(sMessage, "My role position is not high enough!", message);
                if (sMember.roles.has(role.id)) return client.editMsg(sMessage, "That member already has that role!", message);

                sMember.roles.add(role);
                client.editMsg(sMessage, `Successfully added ${role.name} to ${sMember.user.tag}.`, message);
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
                grolecmd(msgToEdit);
            } else {
                grolecmd(message);
            }
        } catch (e) {
            let rollbar = new client.Rollbar(client.rollbarKey);
            rollbar.error("Something went wrong in grole.js", e);
            message.channel.send(`Something went wrong while executing the command: \`${PREFIX}grole\`\n\n\`\`\`xl\n${e}\n\`\`\``);
            console.error(e);
        }
    },
    jyguyOnly: 0
}