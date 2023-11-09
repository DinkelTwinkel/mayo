const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const Banner = require('../models/bannerimages');
const Point = require('../models/points');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('servername')
    .setDescription('changes server name (50 mayo)')
    .addStringOption(option =>
      option
        .setName('name')
        .setDescription('new server name')
        .setRequired(true)),

    async execute(interaction) {

      const cost = 50;
      const checkPouch = await Point.findOne ({userId: interaction.member.id});
      if (checkPouch.points < cost) return interaction.reply (`You do not have enough Mayo! You need ${cost} mayo to perform this action!`);
      checkPouch.points -= cost;
      await checkPouch.save();

      interaction.guild.setName(interaction.options.getString('name'));

      interaction.reply ('server name changed!');

    },
  };

