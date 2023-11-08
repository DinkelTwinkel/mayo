module.exports = {
    data: {
      name: 'ping',
      description: 'Ping Pong!',
    },
    execute(interaction) {
      interaction.reply('Pong!');
    },
  };