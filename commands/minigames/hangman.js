const playing = new Set();
function setCharAt (str, index, chr) {
  if (index > str.length - 1) return str;
  return str.substr(0, index) + chr + str.substr(index + 1);
}

module.exports = async (Client, message, args) => {
  if (playing.has(message.author.id + message.guild.id)) return message.reply('You are already playing a hangman game! Please finish that first.');
  playing.add(message.author.id + message.guild.id);
  const hasPerm = Client.checkClientPerms(message.channel, 'MANAGE_MESSAGES');
  const word = require('random-word')();
  let blurredWord = '_'.repeat(word.length);
  let lives = 12;
  const sLetters = [];
  const allLetters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
  const filter = m => m.author.id === message.author.id && m.channel.id === message.channel.id;
  const collector = message.channel.createMessageCollector(filter, { time: 1000 * 60 * 5 });
  let msg = await message.channel.send(`Successfully started a hangman game. The word is ${Client.escapeMarkdown(blurredWord)}. You have **${lives}** lives left.`);

  collector.on('collect', async m => {
    if (m.content.toLowerCase() === 'stop') {
      collector.stop();
      let content = 'Successfully stopped the minigame.';
      if (msg.deleted) message.channel.send(content);
      else msg.edit(content);
      playing.delete(message.author.id + message.guild.id);
      return;
    }
    if (hasPerm) m.delete();
    const letter = m.content.toLowerCase();
    if (!allLetters.includes(letter)) {
      let content = `That is not a letter! The word is ${Client.escapeMarkdown(blurredWord)}. You have **${lives}** lives left.`;
      if (msg.deleted) msg = await message.channel.send(content);
      else msg.edit(content);
    } else {
      if (sLetters.includes(letter)) {
        let content = `You had already guessed that letter! The word is ${Client.escapeMarkdown(blurredWord)}. You have **${lives}** lives left.`;
        if (msg.deleted) msg = await message.channel.send(content);
        else msg.edit(content);
        return;
      }
      sLetters.push(letter);
      if (word.includes(letter)) {
        const indices = [];
        for (let i = 0; i < word.length; i++) {
          if (word[i] === letter) indices.push(i);
        }
        for (let i = 0; i < indices.length; i++) {
          blurredWord = setCharAt(blurredWord, indices[i], letter);
        }
        if (blurredWord === word) {
          collector.stop();
          playing.delete(message.author.id + message.guild.id);
          let content = `You won! The word was **${word}**, and you had **${lives}** lives left.`;
          if (msg.deleted) message.channel.send(content);
          else msg.edit(content);
        } else {
          let content = `Correct! The word is ${Client.escapeMarkdown(blurredWord)}. You have **${lives}** lives left.`;
          if (msg.deleted) msg = await message.channel.send(content);
          else msg.edit(content);
        }
      } else {
        lives -= 1;
        if (lives === 0) {
          collector.stop();
          playing.delete(message.author.id + message.guild.id);
          return message.channel.send(`You lost all your lives! The word was **${word}**.`);
        } else {
          let content = `That letter is incorrect. The word is ${Client.escapeMarkdown(blurredWord)}. You have **${lives}** lives left.`;
          if (msg.deleted) msg = await message.channel.send(content);
          else msg.edit(content);
        }
      }
    }
  });

  collector.on('end', collected => {
    if (collected.size === 0) {
      playing.delete(message.author.id + message.guild.id);
      return message.reply('Time ran out, stopping the minigame.');
    }
  });
};

module.exports.help = {
  name: 'hangman',
  desc: 'Plays hangman with you! Original by Gami#7891',
  category: 'minigames',
  usage: '?hangman',
  aliases: []
};
