const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const Point = require('../models/points');
const increaseJackPot = require('../patterns/increaseJackPot');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('blackmayo')
    .setDescription('send anonymous message (5 mayo)')
    .addUserOption(option =>
			option
				.setName('target')
				.setDescription('target for black mayo!')
				.setRequired(true))
    .addStringOption(option =>
      option
        .setName('message')
        .setDescription('content')
        .setRequired(true))
    .addStringOption(option =>
      option
        .setName('author')
        .setDescription('who it\'s from')
        .setRequired(false)),

    async execute(interaction) {

      if (interaction.member === interaction.options.getMember('target')) return interaction.reply({ content: 'you cannot black mayo yourself faiza.', ephemeral: true });

      const cost = 5;
      const checkPouch = await Point.findOne ({userId: interaction.member.id});
      if (checkPouch.points < cost) return interaction.reply (`You do not have enough Mayo! You need ${cost} mayo to perform this action!`);
      checkPouch.points -= cost;
      increaseJackPot(cost);
      await checkPouch.save();

      const author = interaction.options.getString ('author') ?? 'anonymous'

      // interaction.channel.send ({ content: `${interaction.options.getMember('target')} you've received mayo!` + '\n`' +  interaction.options.getString ('message') + '`' + `from ${author}` })

      const embed = new EmbedBuilder()
      .setDescription("```" + interaction.options.getString ('message') + "```")
      .setColor("#000000")
      .setFooter({
        text: `✉ from ${author}`,
      });

      interaction.channel.send ({ content: `${interaction.options.getMember('target')} you've received mayo!`, embeds: [embed] })

      interaction.reply({ content: 'black mayo sent!', ephemeral: true })

    },
  };

