const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const Point = require('../models/points');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('8mayo')
    .setDescription('ask mayo a question!')
    .addStringOption(option =>
        option
            .setName('message')
            .setDescription('message for someone somewhere to find... bad messages are deleted.')
            .setRequired(true)),

    async execute(interaction, client) {

        await interaction.deferReply({ephemeral: false});

        // points check.

        const cost = 5;

        const userWallet = await Point.findOne({ userId: interaction.member.id });
        if (userWallet.points < cost) return interaction.editReply({ content: `Insufficient shells, you need ${cost} MAYO to use this.`, ephemeral: true });

        userWallet.points -= cost;
        await userWallet.save();

        const message = interaction.options.getString ('message');

        const reply = await interaction.editReply(`ASK: ${message}`);

        const dialogueArray = [
        'Yes', 
        'Maybe', 
        'No', 
        'Consult Summer',
        'Hop on Poolians',
        'Execute order 66.'
        ];

        const rIndex = Math.floor(Math.random() * dialogueArray.length);

        const originalString = dialogueArray[rIndex];

        interaction.followUp (originalString);

    },
  };

