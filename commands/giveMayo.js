const { SlashCommandBuilder, ActivityType } = require('discord.js');
const Point = require('../models/points');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('give')
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

    async execute(interaction, client) {

      if (interaction.options.getUser('target').id === interaction.member.user.id) return interaction.reply ('You cannot give mayo to yourself!');

      // ephemeral tell user points

      const findPouch = await Point.findOne({ userId: interaction.member.id });
      const targetPouch = await Point.findOne({ userId: interaction.options.getUser('target').id });

      const amountToGive = interaction.options.getInteger('amount');

      if (findPouch.points >= amountToGive) {

        if (interaction.options.getUser('target').id === '1171936614965067866'){
          //detected money given to bot.
          // calculate win chance.
          const total = amountToGive + targetPouch.points;
          const chance = amountToGive / total;
          if (Math.random() < chance) {
            // win
            interaction.reply('*mayo was too full and emptied it\'s stomach!*');
            interaction.channel.send(`Congratulations ${interaction.member}, you have gained ${targetPouch.points} mayo!`);
            findPouch.points += targetPouch.points;
            targetPouch.points = 0;
            
            client.user.setActivity(`JACKPOT: ${targetPouch.points} MAYO`, { type: ActivityType.Watching });
          }
          else {
            // no win moan
            // interaction.channel.send('');
            findPouch.points -= amountToGive;
            targetPouch.points += amountToGive;

            client.user.setActivity(`JACKPOT: ${targetPouch.points} MAYO`, { type: ActivityType.Watching });
  
            interaction.reply (`***MOAN*** - [You didn't win and the jackpot has increased! New jackpot: ${targetPouch.points} MAYO ]`);
          }

        }
        else {

          findPouch.points -= amountToGive;
          targetPouch.points += amountToGive;

          interaction.reply (`${amountToGive} VBUCKS transferred to ${interaction.options.getUser('target')}`);
          
        }

        await findPouch.save();
        await targetPouch.save();

        // mayo lottery

      }
      else {
        interaction.reply ('You don\'t have enough VBUCKS to give!');
      }

    },
  };

