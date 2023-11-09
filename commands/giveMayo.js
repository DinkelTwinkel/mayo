const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const Point = require('../models/points');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('givemayo')
    .setDescription('give someone your mayo!')
    .addUserOption(option =>
			option
				.setName('target')
				.setDescription('target for mayo transfer!')
				.setRequired(true))
		.addIntegerOption(option =>
			option
				.setName('amount')
				.setDescription('amount of mayo to give!')
        .setRequired(true)),

    async execute(interaction) {

      // ephemeral tell user points

      const findPouch = await Point.findOne({ userId: interaction.member.id });
      const targetPouch = await Point.findOne({ userId: interaction.options.getUser('target').id });

      const amountToGive = interaction.options.getInteger('amount');

      if (findPouch.points >= amountToGive) {
        findPouch.points -= amountToGive;
        targetPouch.points += amountToGive;

        await findPouch.save();
        await targetPouch.save();
        interaction.reply (`${amountToGive} mayo transferred to ${interaction.options.getUser('target')}`);

      }
      else {
        interaction.reply ('You don\'t have enough mayo to give!');
      }

    },
  };

