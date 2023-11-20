const { SlashCommandBuilder, ActivityType } = require('discord.js');
const Point = require('../models/points');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('throw')
    .setDescription('throw your mayo at someone!')
    .addUserOption(option =>
			option
				.setName('target')
				.setDescription('target for throwing')
				.setRequired(true))
		.addIntegerOption(option =>
			option
				.setName('amount')
				.setDescription('amount of mayo to throw')
        .setRequired(true)),

    async execute(interaction, client) {

      // ephemeral tell user points

      const findPouch = await Point.findOne({ userId: interaction.member.id });
      const amountToThrow = interaction.options.getInteger('amount');
      const mayoedRow = interaction.guild.roles.cache.get('1172041699783098452');
      const target = interaction.options.getMember('target');

      if (findPouch.points >= amountToThrow) {

        findPouch.points -= amountToThrow;
        await findPouch.save();

        // console.log (target);

        let oldName = target.nickname;
        if (!target.nickname) oldName = target.user.globalName;

        target.roles.add(mayoedRow);

        try {target.setNickname('MAYO' + oldName)

          setTimeout(() => {
            target.roles.remove(mayoedRow);
            target.setNickname(oldName);
          }, 1000 * amountToThrow);
          interaction.reply (`**SQUELCH** ${target} mayo-ed for ${amountToThrow} seconds`);

        }
        catch (err) {};

      }
      else {
        interaction.reply ('You don\'t have enough mayo to throw!');
      }

    },
  };

