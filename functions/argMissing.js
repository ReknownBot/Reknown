/**
 * @param {import('discord.js').TextChannel} channel
 * @param {Number} num
 * @param {String} type
 */
module.exports = (channel, num, type) => channel.send(`:x: Argument #${num} was missing. It is supposed to be: **${type}**.`);
