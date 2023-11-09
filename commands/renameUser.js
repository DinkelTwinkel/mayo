const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const Banner = require('../models/bannerimages');
const Point = require('../models/points');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('rename')
    .setDescription('changes nickname of an user! (50 mayo)')
    .addUserOption(option =>
			option
				.setName('target')
				.setDescription('target to rename!')
				.setRequired(true))
    .addStringOption(option =>
      option
        .setName('name')
        .setDescription('new name!')
        .setRequired(true)),

    async execute(interaction) {

      const cost = 20;
      const checkPouch = await Point.findOne ({userId: interaction.member.id});
      if (checkPouch.points < cost) return interaction.reply (`You do not have enough Mayo! You need ${cost} mayo to perform this action!`);
      checkPouch.points -= cost;
      await checkPouch.save();

      const target = interaction.options.getMember('target');

      if (target.user.id === interaction.guild.ownerId) return interaction.reply ('Server Owner is too powerful, I cannot rename them!');

      target.setNickname(interaction.options.getString('name'));
      interaction.reply ('target name changed!');

    },
  };

