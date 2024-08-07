const { SlashCommandBuilder, ActivityType } = require('discord.js');
const Point = require('../models/points');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('kill')
    .setDescription('kill someone')
    .addUserOption(option =>
			option
				.setName('target')
				.setDescription('target for murdur, costs 1000 mayo')
				.setRequired(true)),

    async execute(interaction, client) {

      // ephemeral tell user points

      const findPouch = await Point.findOne({ userId: interaction.member.id });
      //const targetPouch = await Point.findOne({ userId: interaction.options.getUser('target').id });
      const target = interaction.options.getMember('target');

      const amountToGive = 1000;

      if (findPouch.points >= amountToGive) {

          interaction.reply (`${interaction.options.getUser('target')} has been killed.`);

          target.roles.set(['1172197535922798644']).catch((err) => {});
          findPouch.points -= amountToGive;

          

        await findPouch.save();

        // mayo lottery

      }
      else {
        interaction.reply ('You don\'t have enough mayo to commit murdur!');
      }

    },
  };

