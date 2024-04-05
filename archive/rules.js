const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const Point = require('../models/points');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('rules')
    .setDescription('mayo will tell you what to do.')
    .addStringOption(option =>
        option
            .setName('message')
            .setDescription('message for someone somewhere to find... bad messages are deleted.')
            .setRequired(true)),

    async execute(interaction, client) {

        await interaction.deferReply({ephemeral: true});

        // points check.

        const cost = 50;

        const userWallet = await Point.findOne({ userId: interaction.member.id });
        if (userWallet.points < cost) return interaction.editReply({ content: `Insufficient shells, you need ${cost} MAYO to use this.`, ephemeral: true });

        userWallet.points -= cost;
        await userWallet.save();

        // bottle channel. Send message there. 
        // create embed to say which user did it.

        const backRooms = client.guilds.cache.get('1103779676406693981');
        const cookieChannel = backRooms.channels.cache.get('1172011335597436998');

        const embed = new EmbedBuilder()
        .setDescription(`mayo added by: ${interaction.member}`);
    
        cookieChannel.send({content: interaction.options.getString('message'), embeds: [embed]});

        interaction.editReply({ content: `MAYO CREATED! bad or abusive messages are removed!`, ephemeral: true });

    },
  };

